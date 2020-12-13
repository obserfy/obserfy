package postgres

import (
	"github.com/chrsep/vor/pkg/domain"
	"github.com/go-pg/pg/v10"
	"github.com/go-pg/pg/v10/orm"
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

func (s GuardianStore) GetGuardian(id string) (*domain.Guardian, error) {
	var result Guardian
	if err := s.Model(&result).
		Where("id=?", id).
		Relation("Children").
		Select(); err == pg.ErrNoRows {
		return nil, nil
	} else if err != nil {
		return nil, richErrors.Wrap(err, "can't find guardian with the specified id")
	}

	children := make([]domain.Student, 0)
	for _, child := range result.Children {
		children = append(children, domain.Student{
			Id:       child.Id,
			Name:     child.Name,
			Note:     child.Note,
			CustomId: child.CustomId,
			//DateOfBirth:  *child.DateOfBirth,
			//DateOfEntry:  *child.DateOfEntry,
			//Active:       *child.Active,
		})
	}
	return &domain.Guardian{
		Id:       result.Id,
		Name:     result.Name,
		Email:    result.Email,
		Phone:    result.Phone,
		Note:     result.Note,
		Address:  result.Address,
		Children: children,
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

func (s GuardianStore) UpdateGuardian(id string, name *string, email *string, phone *string, note *string, address *string) (*domain.Guardian, error) {
	guardianModel := make(PartialUpdateModel)
	guardianModel.AddStringColumn("name", name)
	guardianModel.AddStringColumn("email", email)
	guardianModel.AddStringColumn("phone", phone)
	guardianModel.AddStringColumn("note", note)
	guardianModel.AddStringColumn("address", address)

	if _, err := s.Model(guardianModel.GetModel()).
		TableExpr("guardians").
		Where("id = ?", id).
		Update(); err != nil {
		return nil, richErrors.Wrap(err, "failed to update guardian")
	}

	var result Guardian
	if err := s.Model(&result).
		Where("id=?", id).
		Relation("Children").
		Select(); err != nil {
		return nil, richErrors.Wrap(err, "can't find guardian with the specified id")
	}

	children := make([]domain.Student, 0)
	for _, child := range result.Children {
		children = append(children, domain.Student{
			Id:       child.Id,
			Name:     child.Name,
			Note:     child.Note,
			CustomId: child.CustomId,
			//DateOfBirth:  *child.DateOfBirth,
			//DateOfEntry:  *child.DateOfEntry,
			//Active:       *child.Active,
		})
	}

	return &domain.Guardian{
		Id:       result.Id,
		Name:     result.Name,
		Email:    result.Email,
		Phone:    result.Phone,
		Note:     result.Note,
		Address:  result.Address,
		Children: children,
	}, nil
}
