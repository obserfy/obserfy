package school

import "mime/multipart"

type StudentImageStorage interface {
	SaveProfilePicture(studentId string, pic multipart.File, size int64) (string, error)
}
