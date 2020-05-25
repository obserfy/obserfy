package lessonplan

type (
	LessonPlan struct {
		Id          string
		Title       string
		Description string
		ClassId     string
		Repetition  int
	}

	PlanData struct {
		ClassId     string
		Title       string
		Description string
		Repetition  int
	}

	Store interface {
		CreateLessonPlan(input PlanData) (*LessonPlan, error)
		GetLessonPlan(planId string) (*LessonPlan, error)
	}
)
