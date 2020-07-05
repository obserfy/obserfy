package student_test

import (
	"github.com/chrsep/vor/pkg/rest"
	"net/http"
	"testing"
	"time"

	"github.com/brianvoe/gofakeit/v4"
	"github.com/chrsep/vor/pkg/mocks"
	"github.com/chrsep/vor/pkg/postgres"
	"github.com/chrsep/vor/pkg/student"
	"github.com/chrsep/vor/pkg/testutils"
	"github.com/google/uuid"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/suite"
)

type StudentTestSuite struct {
	testutils.BaseTestSuite

	StudentImageStorage mocks.StudentImageStorage
	store               postgres.StudentStore
}

func (s *StudentTestSuite) SetupTest() {
	s.store = postgres.StudentStore{s.DB}
	s.StudentImageStorage = mocks.StudentImageStorage{}
	s.Handler = student.NewRouter(s.Server, s.store).ServeHTTP
}

func TestStudentApi(t *testing.T) {
	suite.Run(t, new(StudentTestSuite))
}

func (s *StudentTestSuite) GenerateStudent(school postgres.School) *postgres.Student {
	t := s.T()
	gofakeit.Seed(time.Now().UnixNano())
	newStudent := postgres.Student{
		Id:       uuid.New().String(),
		Name:     gofakeit.Name(),
		SchoolId: school.Id,
		School:   school,
	}
	err := s.DB.Insert(&newStudent)
	assert.NoError(t, err)
	return &newStudent
}
func (s *StudentTestSuite) TestPatchStudent() {
	t := s.T()
	newSchool := s.GenerateSchool()
	newStudent := s.GenerateStudent(*newSchool)
	payload := struct {
		Name     string `json:"name"`
		CustomId string `json:"customId"`
		Active   bool   `json:"active"`
	}{Name: "kris", Active: false, CustomId: "chris-88"}

	s.CreateRequest("PATCH", "/"+newStudent.Id+"/", payload, &newSchool.Users[0].Id)

	var modifiedStudent postgres.Student
	err := s.DB.Model(&modifiedStudent).
		Where("id=?", newStudent.Id).
		Select()
	assert.NoError(t, err)

	assert.Equal(t, modifiedStudent.Active, &payload.Active)
	assert.Equal(t, modifiedStudent.Name, payload.Name)
	assert.Equal(t, modifiedStudent.CustomId, payload.CustomId)
}

func (s *StudentTestSuite) SaveNewGuardian(school *postgres.School, student *postgres.Student) *postgres.Guardian {
	t := s.T()
	gofakeit.Seed(time.Now().UnixNano())
	newGuardian := postgres.Guardian{
		Id:       uuid.New().String(),
		Name:     gofakeit.Name(),
		Email:    gofakeit.Email(),
		Phone:    gofakeit.Phone(),
		Note:     gofakeit.Paragraph(1, 1, 1, " "),
		SchoolId: school.Id,
		School:   postgres.School{},
		Children: nil,
	}
	err := s.DB.Insert(&newGuardian)
	assert.NoError(t, err)
	if student != nil {
		newGuardianRelation := postgres.GuardianToStudent{
			StudentId:    student.Id,
			GuardianId:   newGuardian.Id,
			Relationship: 0,
		}
		err := s.DB.Insert(&newGuardianRelation)
		assert.NoError(t, err)
	}
	return &newGuardian
}

func (s *StudentTestSuite) TestAddNewGuardian() {
	t := s.T()
	newSchool := s.GenerateSchool()
	newStudent := s.GenerateStudent(*newSchool)
	guardian := s.SaveNewGuardian(newSchool, nil)

	payload := struct {
		Id           string                        `json:"id"`
		Relationship postgres.GuardianRelationship `json:"relationship"`
	}{Id: guardian.Id, Relationship: 0}

	s.CreateRequest("POST", "/"+newStudent.Id+"/guardianRelations", payload, &newSchool.Users[0].Id)

	var modifiedStudent postgres.Student
	err := s.DB.Model(&modifiedStudent).
		Where("id=?", newStudent.Id).
		Relation("Guardians").
		Select()
	assert.NoError(t, err)

	assert.Len(t, modifiedStudent.Guardians, 1)
	assert.Equal(t, modifiedStudent.Guardians[0].Id, guardian.Id)
}

func (s *StudentTestSuite) TestDeleteGuardian() {
	t := s.T()
	newSchool := s.GenerateSchool()
	newStudent := s.GenerateStudent(*newSchool)
	guardian := s.SaveNewGuardian(newSchool, newStudent)

	s.CreateRequest("DELETE", "/"+newStudent.Id+"/guardianRelations/"+guardian.Id, nil, &newSchool.Users[0].Id)

	var modifiedStudent postgres.Student
	err := s.DB.Model(&modifiedStudent).
		Where("id=?", newStudent.Id).
		Relation("Guardians").
		Select()
	assert.NoError(t, err)

	assert.Len(t, modifiedStudent.Guardians, 0)
}

//func (s *StudentTestSuite) ReplaceGuardian() {
//	t := s.T()
//	newSchool := s.SaveNewSchool()
//	newStudent := s.GenerateStudent(*newSchool)
//}

func (s *StudentTestSuite) TestGetLessonPlan() {
	t := s.T()
	gofakeit.Seed(time.Now().UnixNano())
	lessonPlan, userId := s.GenerateLessonPlan()

	url := "/" + lessonPlan.Students[0].Id + "/plans?date=" + lessonPlan.Date.Format(time.RFC3339)
	result := s.CreateRequest("GET", url, nil, &userId)
	assert.Equal(t, http.StatusOK, result.Code)

	type responseBody struct {
		Id          string `json:"id"`
		Title       string `json:"title"`
		Description string `json:"description"`
		Area        struct {
			Id   string `json:"id"`
			Name string `json:"name"`
		} `json:"area,omitempty"`
	}
	var body []responseBody
	err := rest.ParseJson(result.Result().Body, &body)
	assert.NoError(t, err)

	assert.Len(t, body, 1)
	assert.Equal(t, lessonPlan.LessonPlanDetails.Title, body[0].Title)
	assert.Equal(t, lessonPlan.LessonPlanDetails.Description, body[0].Description)
	assert.Equal(t, lessonPlan.LessonPlanDetails.Area.Name, body[0].Area.Name)
	assert.Equal(t, lessonPlan.LessonPlanDetails.Area.Id, body[0].Area.Id)
}
