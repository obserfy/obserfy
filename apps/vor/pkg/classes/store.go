package classes

import (
	"time"
)

type Student struct {
	Id   string `json:"id"`
	Name string `json:"name"`
}
type Class struct {
	Id        string         `json:"id"`
	Name      string         `json:"name"`
	Weekdays  []time.Weekday `json:"weekdays"`
	StartTime time.Time      `json:"startTime"`
	EndTime   time.Time      `json:"endTime"`
	Students  []Student
}
type ClassSession struct {
	Date string `json:"date"`
}
type Store interface {
	DeleteClass(id string) (int, error)
	GetClass(id string) (*Class, error)
	UpdateClass(id string, name string, weekdays []time.Weekday, startTime time.Time, endTime time.Time) (int, error)
	CheckPermission(userId string, classId string) (bool, error)
	GetClassSession(classId string) ([]ClassSession, error)
}
