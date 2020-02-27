package auth

import (
	"github.com/chrsep/vor/pkg/rest"
	"github.com/go-playground/validator/v10"
	richErrors "github.com/pkg/errors"
	"net/http"
)

func resetPassword(s *server) http.Handler {
	type requestBody struct {
		Email string `json:"email" validate:"required,email"`
	}
	validate := validator.New()
	return s.NewHandler(func(w http.ResponseWriter, r *http.Request) *rest.Error {
		var body requestBody
		if err := rest.ParseJson(r.Body, &body); err != nil {
			return rest.NewParseJsonError(err)
		}

		if err := validate.Struct(body); err != nil {
			return &rest.Error{
				http.StatusBadRequest,
				"Invalid email address",
				richErrors.Wrap(err, "Invalid email"),
			}
		}

		// Check if user exists
		user, err := s.store.GetUserByEmail(body.Email)
		if err != nil {
			return &rest.Error{
				http.StatusInternalServerError,
				"Failed getting user by email",
				err,
			}
		}
		if user == nil {
			// Return ok when email does not exist on db, but don't send email.
			return nil
		}

		// create and save token to db
		token, err := s.store.InsertNewToken(user.Id)
		if err != nil {
			return &rest.Error{
				http.StatusInternalServerError,
				"Failed to create new reset token",
				err,
			}
		}

		// attach token to email
		if err := s.mail.SendResetPassword(body.Email, token.Token); err != nil {
			return &rest.Error{
				http.StatusInternalServerError,
				"Failed to send forget password email",
				err,
			}
		}
		return nil
	})
}
