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
	_ = godotenv.Load(
		"../../../../../.env.test",
		"../../../../../.env.local",
		"../../../../../.env",
	)

	var err error
	s.DB, err = connectTestDB()
	if err != nil {
		panic(err)
	}
	s.MinioClient, err = cMinio.NewClient()
	if err != nil {
		fmt.Println("connect minio err")
		fmt.Println(err)
	}
	s.Server = rest.NewServer(zaptest.NewLogger(s.T()))
}

func connectTestDB() (db *pg.DB, err error) {
	db = postgres.Connect(
		"postgres",
		"postgres",
		"localhost:5432",
		nil,
		"defaultdb_test",
	)
	// Wait until connection is healthy
	for {
		err = db.Ping(db.Context())
		if err == nil {
			break
		} else {
			fmt.Println("TestError: PostgreSQL is down")
			fmt.Println(err)
			time.Sleep(1000 * time.Millisecond)
		}
	}

	defer func() {
		if r := recover(); r != nil {
			fmt.Printf("create table panic captured: %s\n", r)
		}
	}()

	// Create table in transaction, if it fails, probably tables are already created, so we can ignore the error.
	_ = db.RunInTransaction(db.Context(), func(tx *pg.Tx) error {
		if err := postgres.InitTables(tx); err != nil {
			return err
		}
		return nil
	})
	return db, nil
}

func (s *BaseTestSuite) GenerateSchool() (*postgres.School, string) {
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

	_, err := s.DB.Model(&newUser).Insert()
	assert.NoError(t, err)
	_, err = s.DB.Model(&curriculum).Insert()
	assert.NoError(t, err)
	_, err = s.DB.Model(&newSchool).Insert()
	assert.NoError(t, err)
	_, err = s.DB.Model(&schoolUserRelation).Insert()
	assert.NoError(t, err)
	return &newSchool, newUser.Id
}

func (s *BaseTestSuite) GenerateStudent(school *postgres.School) *postgres.Student {
	t := s.T()
	if school == nil {
		school, _ = s.GenerateSchool()
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
	_, err := s.DB.Model(&student).Insert()
	assert.NoError(t, err)
	return &student
}

func (s *BaseTestSuite) GenerateMaterial(school *postgres.School) (postgres.Material, string) {
	gofakeit.Seed(time.Now().UnixNano())
	if school == nil {
		school, _ = s.GenerateSchool()
	}
	subject, userId := s.GenerateSubject(school)

	// save subject
	material := postgres.Material{
		Id:        uuid.New().String(),
		Name:      gofakeit.Dog(),
		SubjectId: subject.Id,
		Subject:   subject,
	}
	_, err := s.DB.Model(&material).Insert()
	assert.NoError(s.T(), err)
	return material, userId
}

func (s *BaseTestSuite) GenerateSubject(school *postgres.School) (postgres.Subject, string) {
	gofakeit.Seed(time.Now().UnixNano())
	if school == nil {
		school, _ = s.GenerateSchool()
	}
	// Save area
	area, userId := s.GenerateArea(school)

	// save subject
	originalSubject := postgres.Subject{
		Id:     uuid.New().String(),
		Name:   gofakeit.Dog(),
		AreaId: area.Id,
		Area:   area,
	}
	_, err := s.DB.Model(&originalSubject).Insert()
	assert.NoError(s.T(), err)
	return originalSubject, userId
}

func (s *BaseTestSuite) GenerateArea(school *postgres.School) (postgres.Area, string) {
	gofakeit.Seed(time.Now().UnixNano())
	if school == nil {
		school, _ = s.GenerateSchool()
	}

	area := postgres.Area{
		Id:           uuid.New().String(),
		CurriculumId: school.CurriculumId,
		Curriculum:   school.Curriculum,
		Name:         gofakeit.Dog(),
	}
	_, err := s.DB.Model(&area).Insert()
	assert.NoError(s.T(), err)

	return area, school.Users[0].Id
}

func (s *BaseTestSuite) GenerateClass(school *postgres.School) *postgres.Class {
	t := s.T()
	if school == nil {
		school, _ = s.GenerateSchool()
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
	_, err := s.DB.Model(&newClass).Insert()
	assert.NoError(t, err)
	_, err = s.DB.Model(&newClass.Weekdays).Insert()
	assert.NoError(t, err)
	return &newClass
}

func (s *BaseTestSuite) GenerateLessonPlan(school *postgres.School) (postgres.LessonPlan, string) {
	t := s.T()
	if school == nil {
		school, _ = s.GenerateSchool()
	}
	material, userid := s.GenerateMaterial(school)
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
	link := postgres.LessonPlanLink{
		Id:                  uuid.New(),
		Title:               gofakeit.Name(),
		Url:                 gofakeit.URL(),
		Image:               gofakeit.ImageURL(10, 10),
		Description:         gofakeit.Name(),
		LessonPlanDetailsId: lessonPlanDetails.Id,
	}
	lessonPlanDetails.Links = append(lessonPlanDetails.Links, link)
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

	_, err := s.DB.Model(&lessonPlanDetails).Insert()
	assert.NoError(t, err)
	_, err = s.DB.Model(&lessonPlan).Insert()
	assert.NoError(t, err)
	_, err = s.DB.Model(&studentRelation).Insert()
	assert.NoError(t, err)
	_, err = s.DB.Model(&link).Insert()
	assert.NoError(t, err)

	return lessonPlan, userid
}

func (s *BaseTestSuite) GenerateLessonPlanLink(details postgres.LessonPlanDetails) postgres.LessonPlanLink {
	t := s.T()
	link := postgres.LessonPlanLink{
		Id:                  uuid.New(),
		Title:               gofakeit.Name(),
		Url:                 gofakeit.URL(),
		Image:               gofakeit.ImageURL(10, 10),
		Description:         gofakeit.Name(),
		LessonPlanDetails:   details,
		LessonPlanDetailsId: details.Id,
	}
	_, err := s.DB.Model(&link).Insert()
	assert.NoError(t, err)
	return link
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
	_, err := s.DB.Model(&newGuardian).Insert()
	assert.NoError(t, err)

	return &newGuardian, school.Users[0].Id
}

func (s *BaseTestSuite) GenerateObservation() postgres.Observation {
	currentTime := time.Now().Local()
	gofakeit.Seed(time.Now().UnixNano())
	newSchool, _ := s.GenerateSchool()
	newStudent := s.GenerateStudent(newSchool)

	o := postgres.Observation{
		Id:          uuid.New().String(),
		ShortDesc:   gofakeit.Sentence(10),
		LongDesc:    gofakeit.Paragraph(1, 1, 20, "\n"),
		CategoryId:  "1",
		CreatedDate: currentTime,
		EventTime:   currentTime,
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
		Id:       uuid.New().String(),
		Email:    gofakeit.Email(),
		Name:     gofakeit.Name(),
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

// Deprecated: CreateRequest is no2 being replaced with ApiTest
func (s *BaseTestSuite) CreateRequest(method string, path string, bodyJson interface{}, userId *string) *httptest.ResponseRecorder {
	w := httptest.NewRecorder()

	body, err := json.Marshal(bodyJson)
	assert.NoError(s.T(), err)

	req := httptest.NewRequest(method, path, bytes.NewBuffer(body))
	if userId != nil {
		// Save session to DB
		sessionToken := uuid.New().String()
		_, err := s.DB.Model(&postgres.Session{
			Token:  sessionToken,
			UserId: *userId,
		}).Insert()
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
		_, err := s.DB.Model(&postgres.Session{
			Token:  sessionToken,
			UserId: *userId,
		}).Insert()
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

func (s *BaseTestSuite) GenerateImage(school *postgres.School) postgres.Image {
	t := s.T()
	gofakeit.Seed(time.Now().UnixNano())
	image := postgres.Image{
		Id:        uuid.New(),
		SchoolId:  school.Id,
		School:    *school,
		ObjectKey: uuid.New().String(),
		CreatedAt: gofakeit.Date(),
	}
	_, err := s.DB.Model(&image).Insert()
	assert.NoError(t, err)
	return image
}

func (s *BaseTestSuite) GenerateReport(school *postgres.School) postgres.ProgressReport {
	t := s.T()
	reports := postgres.ProgressReport{
		Id:          uuid.New(),
		SchoolId:    school.Id,
		School:      *school,
		Title:       gofakeit.JobTitle(),
		PeriodStart: gofakeit.Date(),
		PeriodEnd:   gofakeit.Date(),
	}
	_, err := s.DB.Model(&reports).Insert()
	assert.NoError(t, err)
	return reports
}

func (s *BaseTestSuite) GenerateVideo(school *postgres.School, status *string) postgres.Video {
	t := s.T()
	gofakeit.Seed(time.Now().UnixNano())
	video := postgres.Video{
		Id:            uuid.New(),
		AssetId:       uuid.New().String(),
		PlaybackId:    gofakeit.UUID(),
		PlaybackUrl:   gofakeit.URL(),
		ThumbnailUrl:  gofakeit.URL(),
		UploadUrl:     gofakeit.URL(),
		UploadId:      gofakeit.UUID(),
		Status:        "ready",
		UploadTimeout: 60,
		CreatedAt:     time.Now(),
		School:        *school,
		SchoolId:      school.Id,
	}
	if status != nil {
		video.Status = *status
	}
	_, err := s.DB.Model(&video).Insert()
	assert.NoError(t, err)
	return video
}

func (s *BaseTestSuite) NewSession(userId string) auth.Session {
	session := postgres.Session{
		Token:  uuid.NewString(),
		UserId: userId,
	}
	_, _ = s.DB.Model(&session).Insert()
	return auth.Session{
		Token:  session.Token,
		UserId: session.UserId,
	}
}

type H = map[string]interface{}

type ApiMetadata struct {
	Method   string
	Path     string
	UserId   string
	Body     interface{}
	Response interface{}
}

func (s *BaseTestSuite) ApiTest(m ApiMetadata) *httptest.ResponseRecorder {
	body, err := json.Marshal(m.Body)
	s.NoError(err)

	w := httptest.NewRecorder()
	r := httptest.NewRequest(m.Method, m.Path, bytes.NewBuffer(body))

	if m.UserId != "" {
		session := s.NewSession(m.UserId)
		ctx := context.WithValue(r.Context(), auth.SessionCtxKey, &session)
		r = r.WithContext(ctx)
	}
	s.Handler(w, r)

	if m.Response != nil {
		s.NoError(rest.ParseJson(w.Result().Body, m.Response))
	}

	return w
}
