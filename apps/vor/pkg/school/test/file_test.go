package school_test

import (
	"bytes"
	"encoding/json"
	"github.com/brianvoe/gofakeit/v4"
	"github.com/chrsep/vor/pkg/postgres"
	"github.com/stretchr/testify/assert"
	"io/ioutil"
	"mime/multipart"
	"net/http"
	"os"
	"time"
)

func (s *SchoolTestSuite) TestUploadFile() {
	t := s.T()
	gofakeit.Seed(time.Now().UnixNano())
	school := s.SaveNewSchool()

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

	fileSaved := postgres.File{Id: response.Id}
	err = s.DB.Model(&fileSaved).WherePK().Select()
	assert.NoError(t, err)

	assert.Equal(t, fileName, fileSaved.Name)
}
