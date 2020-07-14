package school_test

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

func (s *SchoolTestSuite) TestUploadImage() {
	t := s.T()
	gofakeit.Seed(time.Now().UnixNano())
	school := s.GenerateSchool()

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
	part, err := writer.CreateFormFile("file", fileName)
	assert.NoError(t, err)
	_, err = part.Write(fileContents)
	assert.NoError(t, err)
	err = writer.Close()
	assert.NoError(t, err)

	// Upload Image
	result := s.CreateMultipartRequest("/"+school.Id+"/images", payload, writer.Boundary(), &school.Users[0].Id)
	assert.Equal(t, result.Code, http.StatusCreated)

	// Response with ID
	var response struct {
		Id string `json:"id"`
	}
	err = json.Unmarshal(result.Body.Bytes(), &response)
	assert.NoError(t, err)

	// Make sure ID is really in DB
	fileDataOnDb := postgres.Image{Id: uuid.MustParse(response.Id)}
	err = s.DB.Model(&fileDataOnDb).WherePK().Select()
	assert.NoError(t, err)
	assert.Equal(t, school.Id, fileDataOnDb.SchoolId)

	// Make sure file is in minio
	fileOnMinio, err := s.MinioClient.GetObject("media", fileDataOnDb.ObjectKey, minio.GetObjectOptions{})
	assert.NoError(t, err)
	fileRead, err := ioutil.ReadAll(fileOnMinio)
	assert.NoError(t, err)
	assert.Equal(t, fileContents, fileRead)
}
