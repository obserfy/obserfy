package lessonplan

import "time"

const (
	TypeNormal = 1
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
	}

	RepetitionData struct {
		EndTime    time.Time
		Repetition int
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
		CreateLessonPlan(planInput PlanData, rpInput *RepetitionData) (*LessonPlan, error)
		UpdateLessonPlan(planData UpdatePlanData) (int, error)
		GetLessonPlan(planId string) (*LessonPlan, error)
		DeleteLessonPlan(planId string) error
	}
)
