package postgres

import (
	"github.com/go-pg/pg/v10"
	"github.com/go-pg/pg/v10/orm"
	"github.com/google/uuid"
	richErrors "github.com/pkg/errors"
	"time"
)

type ProgressReportsStore struct {
	*pg.DB
}

func (s ProgressReportsStore) FindReportById(id uuid.UUID) (ProgressReport, error) {
	report := ProgressReport{Id: id}
	if err := s.Model(&report).
		WherePK().
		Relation("StudentReports").
		Relation("StudentReports.Student").
		Relation("StudentReports.Student.Classes").
		Select(); err != nil {
		return ProgressReport{}, richErrors.Wrap(err, "failed to query progress report")
	}

	return report, nil
}

func (s ProgressReportsStore) PatchStudentReport(reportId uuid.UUID, studentId uuid.UUID, ready *bool, comments *string) (StudentReport, error) {
	patchModel := make(PartialUpdateModel)
	patchModel.AddBooleanColumn("ready", ready)
	patchModel.AddStringColumn("general_comments", comments)

	if _, err := s.Model(patchModel.GetModel()).
		TableExpr("student_reports").
		Where("student_id = ? and progress_report_id = ?", studentId, reportId).
		Update(); err != nil {
		return StudentReport{}, richErrors.Wrap(err, "failed to update progress report")
	}

	report := StudentReport{StudentId: studentId, ProgressReportId: reportId}
	if err := s.Model(&report).
		WherePK().
		Select(); err != nil {
		return StudentReport{}, richErrors.Wrap(err, "failed to query progress report")
	}

	return report, nil
}

func (s ProgressReportsStore) FindStudentReportById(reportId uuid.UUID, studentId uuid.UUID) (StudentReport, error) {
	report := StudentReport{StudentId: studentId, ProgressReportId: reportId}
	if err := s.Model(&report).
		Relation("ProgressReport").
		Relation("Student").
		Relation("AreaComments").
		WherePK().
		Select(); err != nil {
		return StudentReport{}, richErrors.Wrap(err, "failed to find student report")
	}

	return report, nil
}

func (s ProgressReportsStore) UpdateReport(
	id uuid.UUID,
	title *string,
	start *time.Time,
	end *time.Time,
	published *bool,
	freezeAssessments *bool,
) (ProgressReport, error) {
	data := make(PartialUpdateModel)
	data.AddBooleanColumn("published", published)
	data.AddStringColumn("title", title)
	data.AddDateColumn("period_start", start)
	data.AddDateColumn("period_end", end)
	data.AddBooleanColumn("freeze_assessments", freezeAssessments)

	if _, err := s.Model(data.GetModel()).
		TableExpr("progress_reports").
		Where("id = ?", id).
		Update(); err != nil {
		return ProgressReport{}, richErrors.Wrap(err, "failed to update progress report")
	}

	if *freezeAssessments {
		// language=postgreSQL
		if _, err := s.Exec(`
			insert into "student_report_assessments" (student_report_progress_report_id, student_report_student_id, material_id, assessments, updated_at) 
			select sr.progress_report_id, sr.student_id, smp.material_id, smp.stage as asssss, smp.updated_at from student_reports sr
				join students s on sr.student_id = s.id
				join student_material_progresses smp on s.id = smp.student_id
			where sr.progress_report_id = ? and smp.stage is not null
			on conflict (student_report_progress_report_id, student_report_student_id, material_id) 
			    do update set assessments = excluded.assessments

		`, id); err != nil {
			return ProgressReport{}, richErrors.Wrap(err, "failed to freeze assessments")
		}
	}

	report, err := s.FindReportById(id)
	if err != nil {
		return ProgressReport{}, richErrors.Wrap(err, "failed to find report")
	}

	return report, nil
}

func (s ProgressReportsStore) FindUserByUserIdAndRelationToReport(reportId uuid.UUID, userId string) (User, error) {
	var report ProgressReport
	if err := s.Model(&report).
		Relation("School").
		Relation("School.Users", func(q *orm.Query) (*orm.Query, error) {
			return q.Where("user_id = ?", userId), nil
		}).
		Where("progress_report.id = ?", reportId).
		Select(); err != nil {
		return User{}, richErrors.Wrap(err, "failed to find report by report and user id")
	}

	if len(report.School.Users) == 1 {
		return report.School.Users[0], nil
	}

	return User{}, nil
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

func (s ProgressReportsStore) UpsertStudentReportAreaComments(reportId uuid.UUID, studentId uuid.UUID, areaId uuid.UUID, comments string) (StudentReportsAreaComment, error) {
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
		return StudentReportsAreaComment{}, richErrors.Wrap(err, "failed to upsert area comments")
	}

	if err := s.Model(&c).WherePK().Select(); err != nil {
		return StudentReportsAreaComment{}, richErrors.Wrap(err, "failed to upsert area comments")
	}

	return c, nil
}
