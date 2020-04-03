package postgres

import (
	"github.com/chrsep/vor/pkg/guardian"
	"github.com/go-pg/pg/v9"
)

type GuardianStore struct {
	pg.DB
}

func (g GuardianStore) CheckPermission(userId string, guardianId string) (bool, error) {
	panic("implement me")
}

func (g GuardianStore) GetGuardian(id string) (guardian.Guardian, error) {
	panic("implement me")
}

func (g GuardianStore) DeleteGuardian(id string) error {
	panic("implement me")
}

func (g GuardianStore) UpdateGuardian(guardian guardian.Guardian) error {
	panic("implement me")
}
