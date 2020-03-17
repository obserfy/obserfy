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
}
