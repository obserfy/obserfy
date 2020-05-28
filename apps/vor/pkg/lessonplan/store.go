package lessonplan

import "time"

const (
	//TypeNormal = 1
	TypeRepeat = 2

	//RepetitionDaily = 0
	//RepetitionWeekly = 1
	//RepetitionMonthly = 2
)

type (
	LessonPlan struct {
		Id          string
		Title       string
		Description string
		ClassId     string
	}

	PlanData struct {
		ClassId     string
		Title       string
		Description string
		Type        int
		Files       []string
	}

	RepetitionData struct {
		StartTime  time.Time
		EndTime    time.Time
		Repetition int
	}

	Store interface {
		CreateLessonPlan(planInput PlanData, rpInput *RepetitionData) (*LessonPlan, error)
		GetLessonPlan(planId string) (*LessonPlan, error)
	}
)
