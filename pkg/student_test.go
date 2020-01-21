package main

import (
	"github.com/go-chi/chi"
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestDeleteStudent(t *testing.T) {
	env := Env{studentStore: MockStudentStore{}}

	r := chi.NewRouter()
	req, err := http.NewRequest("GET", "/api/projects", nil)
	if err != nil {
		t.Fatal(err)
	}

	rr := httptest.NewRecorder()
	handler := deleteStudent(env)
	r.ServeHTTP(rr, req)
	handler.ServeHTTP(rr, req)
}

type MockStudentStore struct{}

func (m MockStudentStore) get(string) (*Student, error) {
	panic("implement me")
}

func (m MockStudentStore) update(*Student) error {
	panic("implement me")
}

func (m MockStudentStore) delete(string) error {
	panic("implement me")
}
