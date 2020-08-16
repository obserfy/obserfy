package student_test

import (
	"bytes"
	"encoding/json"
	"github.com/google/uuid"
	"io/ioutil"
	"mime/multipart"
	"net/http"
	"os"
	"time"

	"github.com/brianvoe/gofakeit/v4"
	"github.com/minio/minio-go/v6"
	"github.com/stretchr/testify/assert"

	"github.com/chrsep/vor/pkg/postgres"
)

func (s *StudentTestSuite) TestUploadImage() {
	t := s.T()
	gofakeit.Seed(time.Now().UnixNano())
	school := s.GenerateSchool()
	student := s.GenerateStudent(school)

	fileName := gofakeit.Name()
	filePath := "icon.png"

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
	part, err := writer.CreateFormFile("image", fileName)
	assert.NoError(t, err)
	_, err = part.Write(fileContents)
	assert.NoError(t, err)
	err = writer.Close()
	assert.NoError(t, err)

	// Upload Image
	result := s.CreateMultipartRequest("/"+student.Id+"/images", payload, writer.Boundary(), &school.Users[0].Id)
	assert.Equal(t, result.Code, http.StatusCreated)

	// Response with ID
	var response struct {
		Id string `json:"id"`
	}
	err = json.Unmarshal(result.Body.Bytes(), &response)
	assert.NoError(t, err)

	// Make sure image is really in DB
	imageOnDb := postgres.Image{Id: uuid.MustParse(response.Id)}
	err = s.DB.Model(&imageOnDb).WherePK().Select()
	assert.NoError(t, err)
	assert.Equal(t, school.Id, imageOnDb.SchoolId)

	// Make sure image is in minio
	imageOnMinio, err := s.MinioClient.GetObject("media", imageOnDb.ObjectKey, minio.GetObjectOptions{})
	assert.NoError(t, err)
	fileRead, err := ioutil.ReadAll(imageOnMinio)
	assert.NoError(t, err)
	assert.Equal(t, fileContents, fileRead)

	// make sure image is related to the student
	studentOnDb := postgres.Student{Id: student.Id}
	err = s.DB.Model(&studentOnDb).WherePK().Relation("Images").Select()
	assert.NoError(t, err)
	assert.Len(t, studentOnDb.Images, 1)
	assert.Equal(t, response.Id, studentOnDb.Images[0].Id.String())
}
