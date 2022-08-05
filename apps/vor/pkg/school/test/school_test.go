package school_test

import (
	"bytes"
	"github.com/chrsep/vor/pkg/domain"
	"github.com/stretchr/testify/mock"
	"io/ioutil"
	"mime/multipart"
	"os"
	"testing"
	"time"

	"github.com/brianvoe/gofakeit/v4"
	"github.com/google/uuid"
	minio2 "github.com/minio/minio-go/v6"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/suite"

	"github.com/chrsep/vor/pkg/minio"
	"github.com/chrsep/vor/pkg/postgres"
	"github.com/chrsep/vor/pkg/school"
	"github.com/chrsep/vor/pkg/testutils"
)

type SchoolTestSuite struct {
	testutils.BaseTestSuite

	StudentImageStorage minio.ImageStorage
	store               postgres.SchoolStore
}

// TODO: this is similar to mailService mock in auth package, consider refactoring it.
type mailServiceMock struct {
	mock.Mock
}

func (m *mailServiceMock) SendInviteEmail(email string, inviterEmail string, inviteCode string) error {
	args := m.Called(email, inviterEmail, inviteCode)
	return args.Error(0)
}

func (s *SchoolTestSuite) SetupTest() {
	t := s.T()
	client, err := minio.NewClient()
	assert.NoError(t, err)
	s.StudentImageStorage = *minio.NewImageStorage(client)

	s.store = postgres.SchoolStore{
		DB:           s.DB,
		FileStorage:  minio.NewFileStorage(s.MinioClient),
		ImageStorage: s.StudentImageStorage,
	}
	s.Handler = school.NewRouter(s.Server, s.store, &mailServiceMock{}, domain.NoopVideoService{}).ServeHTTP
	gofakeit.Seed(time.Now().UnixNano())
}

func TestSchool(t *testing.T) {
	suite.Run(t, new(SchoolTestSuite))
}

func (s *SchoolTestSuite) SaveNewFile() (*postgres.File, string) {
	t := s.T()
	gofakeit.Seed(time.Now().UnixNano())
	newSchool, _ := s.GenerateSchool()

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
	_, err := s.DB.Model(&file).Insert()
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

func (s *SchoolTestSuite) TestPatchSchool() {
	t := s.T()
	gofakeit.Seed(time.Now().UnixNano())
	newSchool, _ := s.GenerateSchool()

	requestBody := struct {
		Name string `json:"name"`
	}{Name: gofakeit.Name()}

	result := s.CreateRequest("PATCH", "/"+newSchool.Id, &requestBody, &newSchool.Users[0].Id)
	assert.Equal(t, 200, result.Code)

	savedSchool := postgres.School{Id: newSchool.Id}
	err := s.DB.Model(&savedSchool).WherePK().Select()
	assert.NoError(t, err)
	assert.Equal(t, requestBody.Name, savedSchool.Name)
}
