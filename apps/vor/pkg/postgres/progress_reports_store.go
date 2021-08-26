package postgres

import (
	"github.com/chrsep/vor/pkg/domain"
	"github.com/go-pg/pg/v10"
	"github.com/google/uuid"
	richErrors "github.com/pkg/errors"
)

type ProgressReportsStore struct {
	*pg.DB
}

func (s ProgressReportsStore) FindReportById(id uuid.UUID) (domain.ProgressReport, error) {
	report := ProgressReport{Id: id}
	if err := s.Model(&report).
		WherePK().
		Relation("StudentReports").
		Relation("StudentReports.Student").
		Select(); err != nil {
		return domain.ProgressReport{}, richErrors.Wrap(err, "failed to query progress report")
	}

	studentReports := make([]domain.StudentReport, len(report.StudentReports))
	for i, report := range report.StudentReports {
		areaComments := make([]domain.StudentReportsAreaComment, len(report.AreaComments))
		for k, comment := range report.AreaComments {
			areaComments[k] = domain.StudentReportsAreaComment{
				Id:       comment.Id,
				Comments: comment.Comments,
				Ready:    comment.Ready,
				Area: domain.Area{
					Id:   comment.Area.Id,
					Name: comment.Area.Name,
				},
			}
		}

		classes := make([]domain.Class, len(report.Student.Classes))
		for k, c := range report.Student.Classes {
			classes[k] = domain.Class{
				Id:   c.Id,
				Name: c.Name,
			}
		}

		studentReports[i] = domain.StudentReport{
			Id:              report.Id,
			Done:            report.Done,
			GeneralComments: report.GeneralComments,
			AreaComments:    areaComments,
			Student: domain.Student{
				Id:      report.StudentId.String(),
				Name:    report.Student.Name,
				Classes: classes,
			},
		}
	}

	return domain.ProgressReport{
		Id:              report.Id,
		Title:           report.Title,
		PeriodStart:     report.PeriodStart,
		PeriodEnd:       report.PeriodEnd,
		StudentsReports: studentReports,
	}, nil
}
