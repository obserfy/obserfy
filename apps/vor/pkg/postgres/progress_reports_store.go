package postgres

import (
	"github.com/chrsep/vor/pkg/domain"
	"github.com/go-pg/pg/v10"
	"github.com/go-pg/pg/v10/orm"
	"github.com/google/uuid"
	richErrors "github.com/pkg/errors"
	"time"
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
		Relation("StudentReports.Student.Classes").
		Select(); err != nil {
		return domain.ProgressReport{}, richErrors.Wrap(err, "failed to query progress report")
	}

	studentReports := make([]domain.StudentReport, len(report.StudentReports))
	for i, report := range report.StudentReports {
		areaComments := make([]domain.StudentReportsAreaComment, len(report.AreaComments))
		for k, comment := range report.AreaComments {
			areaComments[k] = domain.StudentReportsAreaComment{
				StudentReportProgressReportId: comment.StudentReportProgressReportId,
				StudentReportStudentId:        comment.StudentReportStudentId,
				Comments:                      comment.Comments,
				Ready:                         comment.Ready,
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
			Ready:           report.Ready,
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
		Published:       report.Published,
	}, nil
}

func (s ProgressReportsStore) PatchStudentReport(reportId uuid.UUID, studentId uuid.UUID, ready *bool, comments *string) (domain.StudentReport, error) {
	patchModel := make(PartialUpdateModel)
	patchModel.AddBooleanColumn("ready", ready)
	patchModel.AddStringColumn("general_comments", comments)

	if _, err := s.Model(patchModel.GetModel()).
		TableExpr("student_reports").
		Where("student_id = ? and progress_report_id = ?", studentId, reportId).
		Update(); err != nil {
		return domain.StudentReport{}, richErrors.Wrap(err, "failed to update progress report")
	}

	report := StudentReport{
		StudentId:        studentId,
		ProgressReportId: reportId,
	}
	if err := s.Model(&report).
		WherePK().
		Select(); err != nil {
		return domain.StudentReport{}, richErrors.Wrap(err, "failed to query progress report")
	}

	return domain.StudentReport{
		Ready:           report.Ready,
		GeneralComments: report.GeneralComments,
	}, nil
}

func (s ProgressReportsStore) FindStudentReportById(reportId uuid.UUID, studentId uuid.UUID) (domain.StudentReport, error) {
	report := StudentReport{StudentId: studentId, ProgressReportId: reportId}
	if err := s.Model(&report).
		Relation("ProgressReport").
		Relation("Student").
		Relation("AreaComments").
		WherePK().
		Select(); err != nil {
		return domain.StudentReport{}, richErrors.Wrap(err, "failed to find student report")
	}

	areaComments := make([]domain.StudentReportsAreaComment, len(report.AreaComments))
	for k, comment := range report.AreaComments {
		areaComments[k] = domain.StudentReportsAreaComment{
			StudentReportProgressReportId: comment.StudentReportProgressReportId,
			StudentReportStudentId:        comment.StudentReportStudentId,
			Comments:                      comment.Comments,
			Ready:                         comment.Ready,
			Area: domain.Area{
				Id:   comment.AreaId.String(),
				Name: comment.Area.Name,
			},
		}
	}

	return domain.StudentReport{
		ProgressReport: domain.ProgressReport{
			Id:          report.ProgressReport.Id,
			Title:       report.ProgressReport.Title,
			PeriodStart: report.ProgressReport.PeriodStart,
			PeriodEnd:   report.ProgressReport.PeriodEnd,
		},
		AreaComments:    areaComments,
		GeneralComments: report.GeneralComments,
		Ready:           report.Ready,
		Student: domain.Student{
			Id:   report.Student.Id,
			Name: report.Student.Name,
		},
	}, nil
}

func (s ProgressReportsStore) UpdateReport(
	id uuid.UUID,
	published *bool,
	title *string,
	start *time.Time,
	end *time.Time,
) (domain.ProgressReport, error) {
	data := make(PartialUpdateModel)
	data.AddBooleanColumn("published", published)
	data.AddStringColumn("title", title)
	data.AddDateColumn("period_start", start)
	data.AddDateColumn("period_end", end)

	if _, err := s.Model(data.GetModel()).
		TableExpr("progress_reports").
		Where("id = ?", id).
		Update(); err != nil {
		return domain.ProgressReport{}, richErrors.Wrap(err, "failed to update progress report")
	}

	report := ProgressReport{Id: id}
	if err := s.Model(&report).
		Where("id = ?", id).
		Select(); err != nil {
		return domain.ProgressReport{}, richErrors.Wrap(err, "failed to find report")
	}

	return domain.ProgressReport{
		Id:          id,
		Published:   report.Published,
		PeriodEnd:   report.PeriodEnd,
		PeriodStart: report.PeriodStart,
		Title:       report.Title,
	}, nil
}

func (s ProgressReportsStore) FindUserByUserIdAndRelationToReport(reportId uuid.UUID, userId string) (domain.User, error) {
	var report ProgressReport
	if err := s.Model(&report).
		Relation("School").
		Relation("School.Users", func(q *orm.Query) (*orm.Query, error) {
			return q.Where("user_id = ?", userId), nil
		}).
		Where("progress_report.id = ?", reportId).
		Select(); err != nil {
		return domain.User{}, richErrors.Wrap(err, "failed to find report by report and user id")
	}

	if len(report.School.Users) == 1 {
		return domain.User{Id: report.School.Users[0].Id}, nil
	}

	return domain.User{}, nil
}

func (s ProgressReportsStore) DeleteReportById(reportId uuid.UUID) error {
	report := ProgressReport{Id: reportId}
	if _, err := s.Model(&report).
		WherePK().
		Delete(); err != nil {
		return richErrors.Wrap(err, "failed to delete report by id")
	}

	return nil
}

func (s ProgressReportsStore) UpsertStudentReportAreaComments(reportId uuid.UUID, studentId uuid.UUID, areaId uuid.UUID, comments string) (domain.StudentReportsAreaComment, error) {
	c := StudentReportsAreaComment{
		StudentReportProgressReportId: reportId,
		StudentReportStudentId:        studentId,
		AreaId:                        areaId,
		Comments:                      comments,
	}
	if _, err := s.Model(&c).
		WherePK().
		OnConflict("(area_id, student_report_progress_report_id, student_report_student_id) DO UPDATE").
		Insert(); err != nil {
		return domain.StudentReportsAreaComment{}, richErrors.Wrap(err, "failed to upsert area comments")
	}

	return domain.StudentReportsAreaComment{
		StudentReportProgressReportId: reportId,
		StudentReportStudentId:        studentId,
		Comments:                      comments,
		Area: domain.Area{
			Id: areaId.String(),
		},
	}, nil
}
