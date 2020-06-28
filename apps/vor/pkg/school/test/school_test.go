package school_test

import (
	"bytes"
	"github.com/brianvoe/gofakeit/v4"
	"github.com/chrsep/vor/pkg/minio"
	"github.com/chrsep/vor/pkg/mocks"
	"github.com/chrsep/vor/pkg/postgres"
	"github.com/chrsep/vor/pkg/school"
	"github.com/chrsep/vor/pkg/testutils"
	"github.com/google/uuid"
	minio2 "github.com/minio/minio-go/v6"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/suite"
	"io/ioutil"
	"mime/multipart"
	"os"
	"testing"
	"time"
)

type SchoolTestSuite struct {
	testutils.BaseTestSuite

	StudentImageStorage mocks.StudentImageStorage
	store               postgres.SchoolStore
}

func (s *SchoolTestSuite) SetupTest() {
	s.store = postgres.SchoolStore{s.DB, minio.NewFileStorage(s.MinioClient)}
	s.StudentImageStorage = mocks.StudentImageStorage{}
	s.Handler = school.NewRouter(s.Server, s.store, &s.StudentImageStorage, nil).ServeHTTP
}

func TestSchool(t *testing.T) {
	suite.Run(t, new(SchoolTestSuite))
}

func (s *SchoolTestSuite) SaveNewGuardian() (*postgres.Guardian, string) {
	t := s.T()
	gofakeit.Seed(time.Now().UnixNano())
	newSchool := s.GenerateSchool()
	newGuardian := postgres.Guardian{
		Id:       uuid.New().String(),
		Name:     gofakeit.Name(),
		Email:    gofakeit.Email(),
		Phone:    gofakeit.Phone(),
		Note:     gofakeit.Paragraph(1, 3, 20, " "),
		SchoolId: newSchool.Id,
		School:   *newSchool,
	}
	err := s.DB.Insert(&newGuardian)
	assert.NoError(t, err)
	return &newGuardian, newSchool.Users[0].Id
}

func (s *SchoolTestSuite) SaveNewLessonPlan() (*postgres.LessonPlan, string) {
	t := s.T()
	gofakeit.Seed(time.Now().UnixNano())
	newSchool := s.GenerateSchool()
	newClass := s.GenerateClass(*newSchool)

	title := gofakeit.Name()
	description := gofakeit.Name()
	details := postgres.LessonPlanDetails{
		Id:             uuid.New().String(),
		Title:          title,
		Description:    &description,
		ClassId:        newClass.Id,
		Class:          *newClass,
		Files:          nil,
		RepetitionType: 0,
	}
	date := gofakeit.Date()
	newLessonPlan := postgres.LessonPlan{
		Id:                  uuid.New().String(),
		Date:                &date,
		LessonPlanDetailsId: details.Id,
		LessonPlanDetails:   details,
	}
	err := s.DB.Insert(&details)
	assert.NoError(t, err)
	err = s.DB.Insert(&newLessonPlan)
	assert.NoError(t, err)
	return &newLessonPlan, newSchool.Users[0].Id
}

func (s *SchoolTestSuite) SaveNewFile() (*postgres.File, string) {
	t := s.T()
	gofakeit.Seed(time.Now().UnixNano())
	newSchool := s.GenerateSchool()

	fileId := uuid.New().String()
	fileKey := "files/" + newSchool.Id + "/" + fileId
	file := postgres.File{
		Id:          fileId,
		SchoolId:    newSchool.Id,
		School:      *newSchool,
		Name:        gofakeit.Name(),
		LessonPlans: nil,
		ObjectKey:   fileKey,
	}
	err := s.DB.Insert(&file)
	assert.NoError(t, err)

	testfile, _ := s.ReadTestFile(file.Name)
	_, err = s.MinioClient.PutObject("media", fileKey, testfile, int64(testfile.Len()), minio2.PutObjectOptions{})
	assert.NoError(t, err)

	return &file, newSchool.Users[0].Id
}

func (s *SchoolTestSuite) ReadTestFile(name string) (*bytes.Buffer, *multipart.Writer) {
	t := s.T()
	filePath := "testfile.txt"

	// Read file contents
	file, err := os.Open(filePath)
	assert.NoError(t, err)
	fileContents, err := ioutil.ReadAll(file)
	assert.NoError(t, err)
	err = file.Close()
	assert.NoError(t, err)

	// Write file to multipart/form-data
	payload := new(bytes.Buffer)
	writer := multipart.NewWriter(payload)
	part, err := writer.CreateFormFile("file", name)
	assert.NoError(t, err)
	_, err = part.Write(fileContents)
	assert.NoError(t, err)
	err = writer.Close()
	assert.NoError(t, err)

	return payload, writer
}
