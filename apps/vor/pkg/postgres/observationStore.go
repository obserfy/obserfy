package postgres

import (
	"github.com/chrsep/vor/pkg/domain"
	"github.com/go-pg/pg/v10"
	"github.com/go-pg/pg/v10/orm"
	"github.com/google/uuid"
	richErrors "github.com/pkg/errors"
	"mime/multipart"
	"time"
)

type ObservationStore struct {
	*pg.DB
	ImageStorage ImageStorage
}

func (s ObservationStore) GetObservation(id string) (*domain.Observation, error) {
	var observation Observation
	if err := s.Model(&observation).
		Where("Observation.id=?", id).
		Relation("Images").
		Relation("Area").
		Relation("Creator").
		Relation("Student").
		Select(); err == pg.ErrNoRows {
		return nil, nil
	} else if err != nil {
		return nil, richErrors.Wrap(err, "failed getting observation")
	}

	result := domain.Observation{
		Id:          observation.Id,
		StudentName: observation.Student.Name,
		CategoryId:  observation.CategoryId,
		LongDesc:    observation.LongDesc,
		ShortDesc:   observation.ShortDesc,
		EventTime:   observation.EventTime,
		CreatedDate: observation.CreatedDate,
	}
	if observation.Creator != nil {
		result.CreatorId = observation.Creator.Id
		result.CreatorName = observation.Creator.Name
	}
	if observation.AreaId != uuid.Nil {
		result.Area = domain.Area{
			Id:   observation.Area.Id,
			Name: observation.Area.Name,
		}
	}
	for i := range observation.Images {
		result.Images = append(result.Images, domain.Image{
			Id:        observation.Images[i].Id,
			ObjectKey: observation.Images[i].ObjectKey,
			CreatedAt: observation.Images[i].CreatedAt,
		})
	}
	return &result, nil
}

func (s ObservationStore) CheckPermissions(observationId string, userId string) (bool, error) {
	var observation Observation
	if err := s.Model(&observation).
		Relation("Student").
		Relation("Student.School.Users", func(q *orm.Query) (*orm.Query, error) {
			return q.Where("user_id = ?", userId), nil
		}).
		Where("observation.id=?", observationId).
		Select(); err == pg.ErrNoRows {
		return false, nil
	} else if err != nil {
		return false, richErrors.Wrap(err, "failed checking user access to observation")
	}
	if len(observation.Student.School.Users) > 0 {
		return true, nil

	} else {
		return false, nil
	}
}

func (s ObservationStore) UpdateObservation(
	observationId string,
	shortDesc *string,
	longDesc *string,
	eventTime *time.Time,
	areaId *uuid.UUID,
	categoryId *uuid.UUID,
) (*domain.Observation, error) {
	// Create model to update the data
	model := make(PartialUpdateModel)
	model.AddStringColumn("long_desc", longDesc)
	model.AddStringColumn("short_desc", shortDesc)
	model.AddUUIDColumn("category_id", categoryId)
	model.AddDateColumn("event_time", eventTime)
	model.AddUUIDColumn("area_id", areaId)

	if _, err := s.Model(model.GetModel()).
		TableExpr("observations").
		Where("id = ?", observationId).
		Update(); err != nil {
		return nil, err
	}

	// Get newly updated observation
	observation := Observation{Id: observationId}
	if err := s.Model(&observation).
		WherePK().
		Relation("Area").
		Relation("Creator").
		Relation("Images").
		Relation("Student").
		Select(); err != nil {
		return nil, richErrors.Wrap(err, "failed to get updated observation")
	}

	result := domain.Observation{
		Id:          observation.Id,
		StudentId:   observation.StudentId,
		StudentName: observation.Student.Name,
		ShortDesc:   observation.ShortDesc,
		LongDesc:    observation.LongDesc,
		CategoryId:  observation.CategoryId,
		CreatedDate: observation.CreatedDate,
		EventTime:   observation.EventTime,
		CreatorId:   observation.CreatorId,
		CreatorName: observation.Creator.Name,
	}
	if observation.AreaId != uuid.Nil {
		result.Area = domain.Area{
			Id:   observation.Area.Id,
			Name: observation.Area.Name,
		}
	}
	for i := range observation.Images {
		result.Images = append(result.Images, domain.Image{
			Id:        observation.Images[i].Id,
			ObjectKey: observation.Images[i].ObjectKey,
			CreatedAt: observation.Images[i].CreatedAt,
		})
	}
	return &result, nil
}

func (s ObservationStore) DeleteObservation(observationId string) error {
	observation := Observation{Id: observationId}
	return s.Delete(&observation)
}

func (s ObservationStore) CreateImage(observationId string, file multipart.File, header *multipart.FileHeader) (*domain.Image, error) {
	observation := Observation{Id: observationId}
	if err := s.Model(&observation).
		WherePK().
		Relation("Student").
		Select(); err != nil {
		return nil, richErrors.Wrap(err, "failed to get updated observation")
	}

	newImage := Image{
		Id:        uuid.New(),
		SchoolId:  observation.Student.SchoolId,
		ObjectKey: "",
		CreatedAt: time.Time{},
	} // save image to s3
	studentImageRelation := ImageToStudents{
		StudentId: observation.Student.Id,
		ImageId:   newImage.Id.String(),
	}
	observationImageRelation := ObservationToImage{
		ObservationId: observationId,
		ImageId:       newImage.Id,
	}
	objectKey, err := s.ImageStorage.Save(observation.Student.SchoolId, newImage.Id.String(), file, header.Size)
	if err != nil {
		return nil, richErrors.Wrap(err, "failed to save file to s3")
	}
	newImage.ObjectKey = objectKey
	// save data to db
	if err := s.RunInTransaction(func(tx *pg.Tx) error {
		if _, err := tx.Model(&newImage).Insert(); err != nil {
			return richErrors.Wrap(err, "failed to save image")
		}
		if _, err := tx.Model(&studentImageRelation).Insert(); err != nil {
			return richErrors.Wrap(err, "failed to save student image relation")
		}
		if _, err := tx.Model(&observationImageRelation).Insert(); err != nil {
			return richErrors.Wrap(err, "failed to save observation to image relation")
		}
		return nil
	}); err != nil {
		return nil, err
	}
	return &domain.Image{
		Id:        newImage.Id,
		ObjectKey: newImage.ObjectKey,
		CreatedAt: newImage.CreatedAt,
	}, err
}
