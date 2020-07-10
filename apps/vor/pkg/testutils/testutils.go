package testutils

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"net/http/httptest"
	"time"

	"github.com/brianvoe/gofakeit/v4"
	"github.com/go-pg/pg/v10"
	"github.com/google/uuid"
	"github.com/joho/godotenv"
	"github.com/minio/minio-go/v6"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/suite"
	"go.uber.org/zap/zaptest"
	"golang.org/x/crypto/bcrypt"

	"github.com/chrsep/vor/pkg/auth"
	cMinio "github.com/chrsep/vor/pkg/minio"
	"github.com/chrsep/vor/pkg/postgres"
	"github.com/chrsep/vor/pkg/rest"
)

type BaseTestSuite struct {
	suite.Suite
	DB          *pg.DB
	MinioClient *minio.Client
	Handler     http.HandlerFunc
	Server      rest.Server
}

func (s *BaseTestSuite) TearDownSuite() {
	assert.NoError(s.T(), s.DB.Close())
}

func (s *BaseTestSuite) SetupSuite() {
	err := godotenv.Load("../../../../../.env.test")
	if err != nil {
		panic(err)
	}
	s.DB, err = connectTestDB()
	if err != nil {
		panic(err)
	}
	s.MinioClient, err = cMinio.NewClient()
	if err != nil {
		panic(err)
	}
	s.Server = rest.NewServer(zaptest.NewLogger(s.T()))
}

func connectTestDB() (*pg.DB, error) {
	db := postgres.Connect(
		"postgres",
		"postgres",
		"localhost:5432",
		nil,
	)

	// Wait until connection is healthy
	for {
		_, err := db.Exec("SELECT 1")
		if err == nil {
			break
		} else {
			fmt.Println("Error: PostgreSQL is down")
			fmt.Println(err)
			time.Sleep(1000 * time.Millisecond)
		}
	}

	// This is required to reduce the test's flakyness
	// Sometimes the test will on CI with ERROR #23505 duplicate key value violates unique constraint "pg_type_typname_nsp_index"
	// We could just retry creating the tables when that happens.
	err := postgres.InitTables(db)
	if err != nil {
		time.Sleep(time.Second)
		err := postgres.InitTables(db)
		if err != nil {
			return nil, err
		}
	}
	return db, nil
}

func (s *BaseTestSuite) GenerateSchool() *postgres.School {
	t := s.T()
	gofakeit.Seed(time.Now().UnixNano())
	curriculum := postgres.Curriculum{Id: uuid.New().String()}
	newUser := postgres.User{
		Id:    uuid.New().String(),
		Email: gofakeit.Email(),
		Name:  gofakeit.Name(),
	}
	newSchool := postgres.School{
		Id:           uuid.New().String(),
		Name:         gofakeit.Name(),
		InviteCode:   uuid.New().String(),
		Users:        []postgres.User{},
		CurriculumId: curriculum.Id,
	}
	newSchool.Users = []postgres.User{newUser}
	curriculum.Schools = []postgres.School{newSchool}
	schoolUserRelation := postgres.UserToSchool{
		SchoolId: newSchool.Id,
		UserId:   newUser.Id,
	}
	newSchool.Curriculum = curriculum

	assert.NoError(t, s.DB.Insert(&newUser))
	assert.NoError(t, s.DB.Insert(&curriculum))
	assert.NoError(t, s.DB.Insert(&newSchool))
	assert.NoError(t, s.DB.Insert(&schoolUserRelation))
	return &newSchool
}

func (s *BaseTestSuite) GenerateStudent(school *postgres.School) *postgres.Student {
	t := s.T()
	if school == nil {
		school = s.GenerateSchool()
	}
	dob := gofakeit.Date()
	dateOfEntry := gofakeit.Date()
	active := true
	student := postgres.Student{
		Id:          uuid.New().String(),
		Name:        gofakeit.Name(),
		SchoolId:    school.Id,
		School:      *school,
		DateOfBirth: &dob,
		DateOfEntry: &dateOfEntry,
		Note:        gofakeit.Name(),
		CustomId:    gofakeit.Name(),
		Active:      &active,
		ProfilePic:  "",
	}
	err := s.DB.Insert(&student)
	assert.NoError(t, err)
	return &student
}

func (s *BaseTestSuite) GenerateMaterial() (postgres.Material, string) {
	subject, userId := s.GenerateSubject()

	// save subject
	material := postgres.Material{
		Id:        uuid.New().String(),
		Name:      uuid.New().String(),
		SubjectId: subject.Id,
		Subject:   subject,
	}
	err := s.DB.Insert(&material)
	assert.NoError(s.T(), err)
	return material, userId
}

func (s *BaseTestSuite) GenerateSubject() (postgres.Subject, string) {
	// Save area
	area, userId := s.GenerateArea()

	// save subject
	originalSubject := postgres.Subject{
		Id:     uuid.New().String(),
		Name:   uuid.New().String(),
		AreaId: area.Id,
		Area:   area,
	}
	err := s.DB.Insert(&originalSubject)
	assert.NoError(s.T(), err)
	return originalSubject, userId
}

func (s *BaseTestSuite) GenerateArea() (postgres.Area, string) {
	school := s.GenerateSchool()
	area := postgres.Area{
		Id:           uuid.New().String(),
		CurriculumId: school.CurriculumId,
		Curriculum:   school.Curriculum,
		Name:         "",
		Subjects:     nil,
	}
	err := s.DB.Insert(&area)
	assert.NoError(s.T(), err)
	return area, school.Users[0].Id
}

func (s *BaseTestSuite) GenerateClass(school *postgres.School) *postgres.Class {
	t := s.T()
	if school == nil {
		school = s.GenerateSchool()
	}

	newClass := postgres.Class{
		Id:        uuid.New().String(),
		SchoolId:  school.Id,
		School:    *school,
		Name:      gofakeit.Name(),
		StartTime: time.Now(),
		EndTime:   time.Now(),
	}
	newClass.Weekdays = []postgres.Weekday{
		{newClass.Id, time.Sunday, newClass},
		{newClass.Id, time.Thursday, newClass},
		{newClass.Id, time.Friday, newClass},
	}
	err := s.DB.Insert(&newClass)
	assert.NoError(t, err)
	err = s.DB.Insert(&newClass.Weekdays)
	assert.NoError(t, err)
	return &newClass
}

func (s *BaseTestSuite) GenerateLessonPlan() (postgres.LessonPlan, string) {
	t := s.T()
	material, userid := s.GenerateMaterial()
	school := &material.Subject.Area.Curriculum.Schools[0]
	class := s.GenerateClass(school)
	student := s.GenerateStudent(school)

	lessonName := gofakeit.Name()
	lessonPlanDetails := postgres.LessonPlanDetails{
		Id:                uuid.New().String(),
		Title:             gofakeit.Name(),
		Description:       lessonName,
		ClassId:           class.Id,
		Class:             *class,
		RepetitionType:    0,
		RepetitionEndDate: gofakeit.Date(),
		Area:              material.Subject.Area,
		AreaId:            material.Subject.AreaId,
		Material:          material,
		MaterialId:        material.Id,
		SchoolId:          class.SchoolId,
	}
	date := gofakeit.Date()
	lessonPlan := postgres.LessonPlan{
		Id:                  uuid.New().String(),
		Date:                &date,
		LessonPlanDetailsId: lessonPlanDetails.Id,
		LessonPlanDetails:   lessonPlanDetails,
		Students:            []postgres.Student{*student},
	}
	studentRelation := postgres.LessonPlanToStudents{
		LessonPlan:   lessonPlan,
		LessonPlanId: lessonPlan.Id,
		Student:      *student,
		StudentId:    student.Id,
	}

	err := s.DB.Insert(&lessonPlanDetails)
	assert.NoError(t, err)
	err = s.DB.Insert(&lessonPlan)
	assert.NoError(t, err)
	err = s.DB.Insert(&studentRelation)
	assert.NoError(t, err)

	return lessonPlan, userid
}

func (s *BaseTestSuite) GenerateGuardian(school *postgres.School) (*postgres.Guardian, string) {
	t := s.T()
	gofakeit.Seed(time.Now().UnixNano())

	newGuardian := postgres.Guardian{
		Id:       uuid.New().String(),
		Name:     gofakeit.Name(),
		Email:    gofakeit.Email(),
		Phone:    gofakeit.Phone(),
		Note:     gofakeit.Paragraph(1, 3, 20, " "),
		SchoolId: school.Id,
		School:   *school,
	}
	err := s.DB.Insert(&newGuardian)
	assert.NoError(t, err)

	return &newGuardian, school.Users[0].Id
}

func (s *BaseTestSuite) GenerateObservation()  postgres.Observation {
	currentTime := time.Now().Local()
	gofakeit.Seed(time.Now().UnixNano())
	newSchool := s.GenerateSchool()
	newStudent := s.GenerateStudent(newSchool)

	o := postgres.Observation{
		Id:          uuid.New().String(),
		ShortDesc:   gofakeit.Sentence(10),
		LongDesc:    gofakeit.Paragraph(1, 1, 20, "\n"),
		CategoryId:  "1",
		CreatedDate: currentTime,
		EventTime:   &currentTime,
		Student:     newStudent,
		StudentId:   newStudent.Id,
		Creator:     &newSchool.Users[0],
		CreatorId:   newSchool.Users[0].Id,
	}
	_, err := s.DB.Model(&o).Insert()
	assert.NoError(s.T(), err)

	return o
}

func (s *BaseTestSuite) GenerateUser() (*auth.User, error) {
	gofakeit.Seed(time.Now().UnixNano())
	password := gofakeit.Password(true, true, true, true, true, 10)
	hashedPassword, _ := bcrypt.GenerateFromPassword([]byte(password), 10)
	user := postgres.User{
		Id: uuid.New().String(),
		Email: gofakeit.Email(),
		Name: gofakeit.Name(),
		Password: hashedPassword,
	}
	_, err := s.DB.Model(&user).Insert()
	assert.NoError(s.T(), err)

	return &auth.User{
		Id:    user.Id,
		Email: user.Email,
		Name:  user.Name,
	}, nil
}

func (s *BaseTestSuite) GeneratePasswordResetToken() (*auth.PasswordResetToken, error) {
	user, err := s.GenerateUser()
	assert.NoError(s.T(), err)
	currentTime := time.Now()
	expiredAt := currentTime.Add(time.Hour)
	newToken := uuid.New().String()
	token := postgres.PasswordResetToken{
		Token:     newToken,
		CreatedAt: currentTime,
		ExpiredAt: expiredAt,
		UserId:    user.Id,
	}
	_, err = s.DB.Model(&token).Insert()
	assert.NoError(s.T(), err)

	return &auth.PasswordResetToken{
		Token:     token.Token,
		UserId:    token.UserId,
		CreatedAt: token.CreatedAt,
		ExpiredAt: token.ExpiredAt,
		User:      *user,
	}, nil
}

func (s *BaseTestSuite) CreateRequest(method string, path string, bodyJson interface{}, userId *string) *httptest.ResponseRecorder {
	w := httptest.NewRecorder()

	body, err := json.Marshal(bodyJson)
	assert.NoError(s.T(), err)

	req := httptest.NewRequest(method, path, bytes.NewBuffer(body))
	if userId != nil {
		// Save session to DB
		sessionToken := uuid.New().String()
		err := s.DB.Insert(&postgres.Session{
			Token:  sessionToken,
			UserId: *userId,
		})
		assert.NoError(s.T(), err)

		// Save session to context
		ctx := context.WithValue(req.Context(), auth.SessionCtxKey, &auth.Session{
			Token:  sessionToken,
			UserId: *userId,
		})
		s.Handler(w, req.WithContext(ctx))
		return w
	}

	s.Handler(w, req)
	return w
}

func (s *BaseTestSuite) CreateMultipartRequest(url string, multipartForm *bytes.Buffer, boundary string, userId *string) *httptest.ResponseRecorder {
	w := httptest.NewRecorder()

	req := httptest.NewRequest("POST", url, multipartForm)
	req.Header.Set("Content-Type", "multipart/form-data;boundary="+boundary)
	if userId != nil {
		// Save session to DB
		sessionToken := uuid.New().String()
		err := s.DB.Insert(&postgres.Session{
			Token:  sessionToken,
			UserId: *userId,
		})
		assert.NoError(s.T(), err)

		// Save session to context
		ctx := context.WithValue(req.Context(), auth.SessionCtxKey, &auth.Session{
			Token:  sessionToken,
			UserId: *userId,
		})
		s.Handler(w, req.WithContext(ctx))
		return w
	}

	s.Handler(w, req)
	return w
}
