package lessonplan

import "github.com/chrsep/vor/pkg/postgres"

type Store interface {
	CreateLessonPlan(input postgres.PlanData) (*postgres.LessonPlan, error)
}