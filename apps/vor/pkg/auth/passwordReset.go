package auth

import (
	"net/http"

	"github.com/benbjohnson/clock"
	"github.com/go-playground/validator/v10"
	richErrors "github.com/pkg/errors"

	"github.com/chrsep/vor/pkg/rest"
)

func mailPasswordReset(server rest.Server, store Store, mail MailService) http.Handler {
	type requestBody struct {
		Email string `json:"email" validate:"required,email"`
	}
	validate := validator.New()
	return server.NewHandler(func(w http.ResponseWriter, r *http.Request) *rest.Error {
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
		user, err := store.GetUserByEmail(body.Email)
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
		token, err := store.NewPasswordResetToken(user.Id)
		if err != nil {
			return &rest.Error{
				http.StatusInternalServerError,
				"Failed to create new reset token",
				err,
			}
		}

		// attach token to email
		if err := mail.SendResetPassword(body.Email, token.Token); err != nil {
			return &rest.Error{
				http.StatusInternalServerError,
				"Failed to send forget password email",
				err,
			}
		}
		return nil
	})
}

func doPasswordReset(server rest.Server, store Store, mail MailService, clock clock.Clock) http.Handler {
	type requestBody struct {
		Token    string `json:"token" validate:"required,uuid4"`
		Password string `json:"password" validate:"required"`
	}
	validate := validator.New()
	return server.NewHandler(func(w http.ResponseWriter, r *http.Request) *rest.Error {
		var body requestBody
		if err := rest.ParseJson(r.Body, &body); err != nil {
			return rest.NewParseJsonError(
				richErrors.Wrap(err, "Failed parsing input"),
			)
		}

		// Validate input
		if err := validate.Struct(body); err != nil {
			return &rest.Error{
				http.StatusBadRequest,
				"Invalid token and password format",
				err,
			}
		}

		// Get the token from db
		token, err := store.GetPasswordResetToken(body.Token)
		if err != nil {
			return &rest.Error{
				http.StatusInternalServerError,
				"Failed querying token",
				err,
			}
		}
		if token == nil {
			return &rest.Error{
				http.StatusUnauthorized,
				"This reset password link has expired",
				richErrors.New("Can't find the given token"),
			}
		}

		// Validate that token is still valid
		currentTime := clock.Now()
		if currentTime.After(token.ExpiredAt) {
			return &rest.Error{
				http.StatusUnauthorized,
				"This reset password link has expired",
				richErrors.New("Token has expired"),
			}
		}

		// update the user password && delete all the user session && delete token
		if err := store.DoPasswordReset(token.UserId, body.Password, token.Token); err != nil {
			return &rest.Error{
				http.StatusInternalServerError,
				"Failed updating password",
				err,
			}
		}

		// Send email to user notifying password has been updated.
		if err := mail.SendPasswordResetSuccessful(token.User.Email); err != nil {
			return &rest.Error{
				http.StatusInternalServerError,
				"Failed sending password reset success email",
				richErrors.Wrap(err, "Failed sending password reset success mail"),
			}
		}

		return nil
	})
}
