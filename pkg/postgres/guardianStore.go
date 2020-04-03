package postgres

import (
	"github.com/chrsep/vor/pkg/guardian"
	"github.com/go-pg/pg/v9"
	richErrors "github.com/pkg/errors"
)

type GuardianStore struct {
	pg.DB
}

func (s GuardianStore) CheckPermission(userId string, guardianId string) (bool, error) {
	var userToSchoolRelation []UserToSchool
	if err := s.Model(&userToSchoolRelation).
		Relation("School").
		Relation("Guardians").
		Where("user_id=? AND guardian.id=?", userId, guardianId).
		Select(); err != nil {
		return false, err
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

func (s GuardianStore) DeleteGuardian(id string) error {
	var result Guardian
	if _, err := s.Model(&result).
		Where("id=?", id).
		Delete(); err == pg.ErrNoRows {
		return nil
	} else if err != nil {
		return richErrors.Wrap(err, "can't find guardian with the specified id")
	}
	return nil
}

func (s GuardianStore) UpdateGuardian(guardian guardian.Guardian) error {
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
		return richErrors.Wrap(err, "failed to update guardian")
	}
	return nil
}
