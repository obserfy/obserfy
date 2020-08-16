package domain

import (
	"github.com/google/uuid"
	"time"
)

// contains our core domain model
type Image struct {
	Id        uuid.UUID `pg:"type:uuid"`
	ObjectKey string
	CreatedAt time.Time `pg:"default:now()"`
}
