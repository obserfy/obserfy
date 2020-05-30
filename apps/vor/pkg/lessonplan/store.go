package lessonplan

import "time"

const (
	RepetitionNone = iota
	RepetitionDaily
	RepetitionWeekly
	RepetitionMonthly
)

type (
	LessonPlan struct {
		Id          string
		Title       string
		Description string
		ClassId     string
		Type        int
		StartTime   time.Time
	}

	PlanData struct {
		ClassId     string
		Title       string
		Description string
		Type        int
		Files       []string
		StartTime   time.Time
		EndTime     *time.Time
	}

	UpdatePlanData struct {
		PlanId      string
		Title       *string
		Description *string
		Type        *int
		Repetition  *int
		StartTime   *time.Time
		EndTime     *time.Time
	}

	Store interface {
		CreateLessonPlan(planInput PlanData) (*LessonPlan, error)
		UpdateLessonPlan(planData UpdatePlanData) (int, error)
		GetLessonPlan(planId string) (*LessonPlan, error)
		DeleteLessonPlan(planId string) error
	}
)
