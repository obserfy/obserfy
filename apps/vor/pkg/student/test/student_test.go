package student_test

import (
	"github.com/brianvoe/gofakeit/v4"
	"github.com/chrsep/vor/pkg/mocks"
	"github.com/chrsep/vor/pkg/postgres"
	"github.com/chrsep/vor/pkg/student"
	"github.com/chrsep/vor/pkg/testutils"
	"github.com/google/uuid"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/suite"
	"testing"
	"time"
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

func (s *StudentTestSuite) SaveNewStudent(school postgres.School) *postgres.Student {
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
	newStudent := s.SaveNewStudent(*newSchool)
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
	newStudent := s.SaveNewStudent(*newSchool)
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
//	newSchool := s.GenerateSchool()
//	newStudent := s.SaveNewStudent(*newSchool)
//}
