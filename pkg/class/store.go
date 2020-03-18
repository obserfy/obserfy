package class

import "time"

type Class struct {
	Id        string         `json:"id"`
	Name      string         `json:"name"`
	Weekdays  []time.Weekday `json:"weekdays"`
	StartTime time.Time      `json:"startTime"`
	EndTime   time.Time      `json:"endTime"`
}

type Store interface {
	DeleteClass(id string) (int, error)
	GetClass(id string) (*Class, error)
	UpdateClass(id string, name string, weekdays []time.Weekday, startTime time.Time, endTime time.Time) (int, error)
}
