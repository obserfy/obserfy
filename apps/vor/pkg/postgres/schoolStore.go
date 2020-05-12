package postgres

import (
	"github.com/go-pg/pg/v9"
	"github.com/google/uuid"
	richErrors "github.com/pkg/errors"
	"time"
)

type (
	SchoolStore struct {
		*pg.DB
	}

	GuardianRelation struct {
		SchoolId     string
		Name         string
		Email        string
		Phone        string
		Note         string
		Relationship *int
		StudentId    *string
	}
)

func (s SchoolStore) NewSchool(schoolName, userId string) (*School, error) {
	id := uuid.New()
	inviteCode := uuid.New()
	school := School{
		Id:         id.String(),
		Name:       schoolName,
		InviteCode: inviteCode.String(),
	}
	userToSchoolRelation := UserToSchool{
		SchoolId: id.String(),
		UserId:   userId,
	}
	err := s.RunInTransaction(func(tx *pg.Tx) error {
		if err := s.Insert(&school); err != nil {
			return err
		}
		if err := s.Insert(&userToSchoolRelation); err != nil {
			return err
		}
		return nil
	})

	if err != nil {
		return nil, err
	}
	return &school, nil
}

func (s SchoolStore) GetSchool(schoolId string) (*School, error) {
	var school School
	if err := s.Model(&school).
		Relation("Users").
		Where("id=?", schoolId).
		Select(); err != nil {
		return nil, err
	}
	return &school, nil
}

func (s SchoolStore) GetStudents(schoolId string) ([]Student, error) {
	var students []Student
	if err := s.Model(&students).
		Where("school_id=?", schoolId).
		Order("name").
		Select(); err == pg.ErrNoRows {
		return make([]Student, 0), nil
	} else if err != nil {
		return nil, richErrors.Wrap(err, "Failed querying student")
	}
	return students, nil
}

func (s SchoolStore) GetClassAttendance(classId, session string) ([]Attendance, error) {
	var attendance []Attendance
	if session == "" {
		session = "1970-01-01"
	}
	if err := s.Model(&attendance).
		Where("class_id=?", classId).
		Where("date::date=?", session).
		Relation("Student").
		Relation("Class.Students").
		Select(); err != nil {
		return nil, err
	}
	return attendance, nil
}

func (s SchoolStore) NewStudent(student Student, classes []string, guardians map[string]int) error {
	if student.Id == "" {
		student.Id = uuid.New().String()
	}
	if err := s.RunInTransaction(func(tx *pg.Tx) error {
		classRelations := make([]StudentToClass, len(classes))
		for i, class := range classes {
			classRelations[i] = StudentToClass{
				StudentId: student.Id,
				ClassId:   class,
			}
		}

		guardianRelations := make([]GuardianToStudent, 0)
		for id, guardian := range guardians {
			guardianRelations = append(guardianRelations, GuardianToStudent{
				StudentId:    student.Id,
				GuardianId:   id,
				Relationship: GuardianRelationship(guardian),
			})
		}

		if err := tx.Insert(&student); err != nil {
			return richErrors.Wrap(err, "failed to save new student")
		}
		if len(classRelations) > 0 {
			if err := tx.Insert(&classRelations); err != nil {
				return richErrors.Wrap(err, "failed to save student to class relation")
			}
		}
		if len(guardianRelations) > 0 {
			if err := tx.Insert(&guardianRelations); err != nil {
				return richErrors.Wrap(err, "failed to save guardian to student relation")
			}
		}
		return nil
	}); err != nil {
		return err
	}
	return nil
}

func (s SchoolStore) RefreshInviteCode(schoolId string) (*School, error) {
	// TODO: This should be done in a single query
	var school School
	if err := s.Model(&school).
		Where("id=?", schoolId).
		Select(); err != nil {
		return nil, err
	}

	// Update invite code
	school.InviteCode = uuid.New().String()
	if err := s.Update(&school); err != nil {
		return nil, err
	}
	return &school, nil
}

func (s SchoolStore) NewDefaultCurriculum(schoolId string) error {
	school, err := s.GetSchool(schoolId)
	if err != nil {
		return richErrors.Wrap(err, "Failed saving school")
	}

	c := createDefault()
	err = s.RunInTransaction(
		func(tx *pg.Tx) error {
			// Save the curriculum tree.
			if err := tx.Insert(&c); err != nil {
				return err
			}
			for _, area := range c.Areas {
				if err := tx.Insert(&area); err != nil {
					return err
				}
				for _, subject := range area.Subjects {
					if err := tx.Insert(&subject); err != nil {
						return err
					}
					for _, material := range subject.Materials {
						if err := tx.Insert(&material); err != nil {
							return err
						}
					}
				}
			}

			// Update the school with the new curriculum id
			school.CurriculumId = c.Id
			if err := tx.Update(school); err != nil {
				return err
			}
			return nil
		})
	if err != nil {
		return err
	}
	return nil
}

func (s SchoolStore) DeleteCurriculum(schoolId string) error {
	school, err := s.GetSchool(schoolId)
	if err != nil {
		return err
	}
	if school.CurriculumId == "" {
		return EmptyCurriculumError{}
	}
	c := Curriculum{Id: school.CurriculumId}
	return s.Delete(&c)
}

func (s SchoolStore) GetCurriculum(schoolId string) (*Curriculum, error) {
	var school School
	err := s.Model(&school).
		Relation("Curriculum").
		Where("school.id=?", schoolId).
		Select()
	if err != nil {
		return nil, err
	}
	if school.CurriculumId == "" {
		return nil, EmptyCurriculumError{}
	}
	return &school.Curriculum, nil
}

func (s SchoolStore) GetCurriculumAreas(schoolId string) ([]Area, error) {
	var school School
	err := s.Model(&school).
		Relation("Curriculum").
		Relation("Curriculum.Areas").
		Where("school.id=?", schoolId).
		Select()
	if err != nil {
		return nil, err
	}
	if school.CurriculumId == "" {
		return nil, EmptyCurriculumError{}
	}
	return school.Curriculum.Areas, nil
}

func (s SchoolStore) NewClass(id string, name string, weekdays []time.Weekday, startTime, endTime time.Time) error {
	newClass := Class{
		Id:        uuid.New().String(),
		SchoolId:  id,
		Name:      name,
		StartTime: startTime,
		EndTime:   endTime,
	}
	var dbWeekdays []Weekday
	for _, weekday := range weekdays {
		dbWeekdays = append(dbWeekdays, Weekday{
			ClassId: newClass.Id,
			Day:     weekday,
		})
	}
	if err := s.DB.RunInTransaction(func(tx *pg.Tx) error {
		if err := tx.Insert(&newClass); err != nil {
			return richErrors.Wrap(err, "Failed saving new class")
		}
		if len(dbWeekdays) > 0 {
			if err := tx.Insert(&dbWeekdays); err != nil {
				return richErrors.Wrap(err, "Failed saving weekdays")
			}
		}
		return nil
	}); err != nil {
		return err
	}
	return nil
}

func (s SchoolStore) GetSchoolClasses(schoolId string) ([]Class, error) {
	var classes []Class
	if err := s.DB.Model(&classes).
		Where("school_id=?", schoolId).
		Relation("Weekdays").
		Select(); err != nil {
		return nil, err
	}
	return classes, nil
}

func (s SchoolStore) InsertGuardianWithRelation(input GuardianRelation) (*Guardian, error) {
	guardian := Guardian{
		Id:       uuid.New().String(),
		Name:     input.Name,
		Email:    input.Email,
		Phone:    input.Phone,
		Note:     input.Note,
		SchoolId: input.SchoolId,
	}
	if err := s.RunInTransaction(func(tx *pg.Tx) error {
		if _, err := s.Model(&guardian).Insert(); err != nil {
			return richErrors.Wrap(err, "failed to insert new guardian")
		}

		// Creating relation is optional
		if input.StudentId != nil && input.Relationship != nil {
			relation := GuardianToStudent{
				StudentId:    *input.StudentId,
				GuardianId:   guardian.Id,
				Relationship: GuardianRelationship(*input.Relationship),
			}
			if _, err := s.Model(&relation).Insert(); err != nil {
				return richErrors.Wrap(err, "failed to insert guardian to student relation")
			}
		}
		return nil
	}); err != nil {
		return nil, err
	}
	return &guardian, nil
}

func (s SchoolStore) GetGuardians(schoolId string) ([]Guardian, error) {
	var guardian []Guardian

	if err := s.DB.Model(&guardian).
		Where("school_id=?", schoolId).
		Select(); err != nil {
		return nil, richErrors.Wrap(err, "failed to query school's guardians")
	}
	return guardian, nil
}

type EmptyCurriculumError struct{}

func (e EmptyCurriculumError) Error() string {
	return "School doesn't have curriculum"
}
