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
	err := s.Model(&report).
		WherePK().
		Select()
	if err != nil {
		return domain.ProgressReport{}, richErrors.Wrap(err, "failed to query progress report")
	}

	return domain.ProgressReport{
		Id:          report.Id,
		Title:       report.Title,
		PeriodStart: report.PeriodStart,
		PeriodEnd:   report.PeriodEnd,
	}, nil
}
