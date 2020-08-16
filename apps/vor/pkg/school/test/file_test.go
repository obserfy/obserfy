package school_test

import (
	"bytes"
	"encoding/json"
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

func (s *SchoolTestSuite) TestUploadFile() {
	t := s.T()
	gofakeit.Seed(time.Now().UnixNano())
	school := s.GenerateSchool()

	fileName := gofakeit.Name()
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
	part, err := writer.CreateFormFile("file", fileName)
	assert.NoError(t, err)
	_, err = part.Write(fileContents)
	assert.NoError(t, err)
	err = writer.Close()
	assert.NoError(t, err)

	result := s.CreateMultipartRequest("/"+school.Id+"/files", payload, writer.Boundary(), &school.Users[0].Id)
	assert.Equal(t, result.Code, http.StatusCreated)

	var response struct {
		Id string `json:"id"`
	}
	err = json.Unmarshal(result.Body.Bytes(), &response)
	assert.NoError(t, err)

	fileDataOnDb := postgres.File{Id: response.Id}
	err = s.DB.Model(&fileDataOnDb).WherePK().Select()
	assert.NoError(t, err)

	assert.Equal(t, fileName, fileDataOnDb.Name)

	// Get and compare file from minio with the test file
	fileOnMinio, err := s.MinioClient.GetObject("media", fileDataOnDb.ObjectKey, minio.GetObjectOptions{})
	assert.NoError(t, err)
	fileRead, err := ioutil.ReadAll(fileOnMinio)
	assert.NoError(t, err)
	assert.Equal(t, fileContents, fileRead)
}

func (s *SchoolTestSuite) TestPatchFile() {
	t := s.T()
	gofakeit.Seed(time.Now().UnixNano())
	// Generates new data and save it to db
	file, userId := s.SaveNewFile()

	// Setup payload
	payload := struct {
		Name string `json:"name"`
	}{Name: gofakeit.Name()}

	// Send request with payload
	result := s.CreateRequest("PATCH", "/"+file.SchoolId+"/files/"+file.Id, payload, &userId)
	assert.Equal(t, http.StatusNoContent, result.Code)

	// Query the data from db
	updatedFile := postgres.File{Id: file.Id}
	err := s.DB.Model(&updatedFile).WherePK().Select()

	// Assert data got updated properly.
	assert.NoError(t, err)
	assert.Equal(t, payload.Name, updatedFile.Name)
}

func (s *SchoolTestSuite) TestDeleteFile() {
	t := s.T()
	gofakeit.Seed(time.Now().UnixNano())
	file, userId := s.SaveNewFile()

	payload := struct {
		Name string `json:"name"`
	}{Name: gofakeit.Name()}
	result := s.CreateRequest("DELETE", "/"+file.SchoolId+"/files/"+file.Id, payload, &userId)
	assert.Equal(t, http.StatusOK, result.Code)

	updatedFile := postgres.File{Id: file.Id}
	err := s.DB.Model(&updatedFile).WherePK().Select()
	assert.Error(t, err)

	_, err = s.MinioClient.StatObject("media", file.ObjectKey, minio.StatObjectOptions{})
	assert.Error(t, err)
}
