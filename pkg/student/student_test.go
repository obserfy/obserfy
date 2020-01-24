package student

// delete an existing student should return 200 ok
//func TestDeleteExistingStudent(t *testing.T) {
//	students := generateStudents()
//	env := env{store: FakeStudentStore{students}}
//
//	rr, r := createRoute(env)
//	req, err := http.NewRequest("DELETE", "/"+students[0].Id, nil)
//	if err != nil {
//		t.Fatal(err)
//	}
//
//	r.ServeHTTP(rr, req)
//	if rr.Result().StatusCode != http.StatusOK {
//		t.Errorf("")
//	}
//}

// delete non existing student
// delete on random id
//func createRoute(env env) (*httptest.ResponseRecorder, *chi.Mux) {
//	rr := httptest.NewRecorder()
//	r := NewRouter(env.logger, env.store)
//	return rr, r
//}
//
//func generateStudents() []postgres.Student {
//	return []postgres.Student{
//		{Id: uuid.New().String()},
//		{Id: uuid.New().String()},
//		{Id: uuid.New().String()},
//	}
//}
//
//type FakeStudentStore struct {
//	students []postgres.Student
//}
//
//func (m FakeStudentStore) Get(string) (*postgres.Student, error) {
//	panic("implement me")
//}
//
//func (m FakeStudentStore) Update(*postgres.Student) error {
//	panic("implement me")
//}
//
//func (m FakeStudentStore) Delete(studentId string) error {
//	for _, student := range m.students {
//		if student.Id == studentId {
//			return nil
//		}
//	}
//	return pg.ErrNoRows
//}
