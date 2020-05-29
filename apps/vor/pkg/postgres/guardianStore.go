package postgres

import (
	"github.com/chrsep/vor/pkg/guardian"
	"github.com/go-pg/pg/v9"
	"github.com/go-pg/pg/v9/orm"
	richErrors "github.com/pkg/errors"
)

type GuardianStore struct {
	*pg.DB
}

func (s GuardianStore) CheckPermission(userId string, guardianId string) (bool, error) {
	var target Guardian
	if err := s.Model(&target).
		Relation("School.id").
		Relation("School.Users", func(q *orm.Query) (*orm.Query, error) {
			return q.Where("id=?", userId).Column("id", "school_id"), nil
		}).
		Column("guardian.id").
		Where("guardian.id=?", guardianId).
		First(); err == pg.ErrNoRows {
		return false, nil
	} else if err != nil {
		return false, richErrors.Wrap(err, "failed to query guardian data")
	}
	if len(target.School.Users) == 0 {
		return false, nil
	}
	return true, nil
}

func (s GuardianStore) GetGuardian(id string) (*guardian.Guardian, error) {
	var result Guardian
	if err := s.Model(&result).
		Where("id=?", id).
		Select(); err == pg.ErrNoRows {
		return nil, nil
	} else if err != nil {
		return nil, richErrors.Wrap(err, "can't find guardian with the specified id")
	}
	return &guardian.Guardian{
		Id:    result.Id,
		Name:  result.Name,
		Email: result.Email,
		Phone: result.Phone,
		Note:  result.Note,
	}, nil
}

func (s GuardianStore) DeleteGuardian(id string) (int, error) {
	var target Guardian
	result, err := s.Model(&target).
		Where("id=?", id).
		Delete()
	if err == pg.ErrNoRows {
		return 0, nil
	} else if err != nil {
		return 0, richErrors.Wrap(err, "failed to delete guardian from db")
	}
	return result.RowsAffected(), nil
}

func (s GuardianStore) UpdateGuardian(guardian guardian.Guardian) (int, error) {
	target := Guardian{
		Id:    guardian.Id,
		Name:  guardian.Name,
		Email: guardian.Email,
		Phone: guardian.Phone,
		Note:  guardian.Note,
	}
	if _, err := s.Model(&target).
		WherePK().
		UpdateNotZero(); err != nil {
		return 0, richErrors.Wrap(err, "failed to update guardian")
	}
	return 0, nil
}
