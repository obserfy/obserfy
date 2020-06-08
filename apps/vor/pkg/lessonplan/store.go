package lessonplan

import "time"

const (
	RepetitionNone = iota
	RepetitionDaily
	RepetitionWeekly
	RepetitionMonthly
)

type (
	RepetitionPattern struct {
		Type    int
		EndDate time.Time
	}

	LessonPlan struct {
		Id          string
		Title       string
		Description string
		ClassId     string
		FileIds     []string
		Date        time.Time
		Repetition  *RepetitionPattern
	}

	PlanData struct {
		Id          string
		Title       string
		Description string
		ClassId     string
		FileIds     []string
		Date        time.Time
		Repetition  *RepetitionPattern
	}

	UpdatePlanData struct {
		Id          string
		Title       *string
		Description *string
		Date        *time.Time
		Repetition  *RepetitionPattern
	}

	Store interface {
		CreateLessonPlan(planInput PlanData) (*LessonPlan, error)
		UpdateLessonPlan(planData UpdatePlanData) (int, error)
		GetLessonPlan(planId string) (*LessonPlan, error)
		DeleteLessonPlan(planId string) error
		DeleteLessonPlanFile(planId, fileId string) error
	}
)
