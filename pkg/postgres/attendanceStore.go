package postgres

import (
	"github.com/go-pg/pg/v9"
	"github.com/google/uuid"
)
type AttendanceStore struct {
	*pg.DB
}
func (s AttendanceStore) NewAttendance(studentId string,classId string)(*Attendance,error){
	id := uuid.New()
	attendance := Attendance{
		Id:         id.String(),
		StudentId:       studentId,
		ClassId: classId,
	}
	err := s.RunInTransaction(func(tx *pg.Tx) error {
		if err := s.Insert(&attendance); err != nil {
			return err
		}
		return nil
	})

	if err != nil {
		return nil, err
	}
	return &attendance, nil
}
func (s AttendanceStore) GetAttendance(schoolId string) (*Attendance, error) {
	var attendance Attendance
	if err := s.Model(&attendance).
		Relation("Student").
		//Where("id=?", schoolId).
		Select(); err != nil {
		return nil, err
	}
	return &attendance, nil
}