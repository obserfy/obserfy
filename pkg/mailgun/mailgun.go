package mailgun

import (
	"bytes"
	"context"
	"github.com/mailgun/mailgun-go/v4"
	richErrors "github.com/pkg/errors"
	"html/template"
	"os"
	"time"
)

type Service struct {
	mailgun mailgun.Mailgun
}

func (s Service) SendResetPassword(email string) error {
	t, err := template.ParseFiles("pkg/mailgun/reset-password.html")
	if err != nil {
		return richErrors.Wrap(err, "Failed parsing reset-password.html")
	}
	body := new(bytes.Buffer)
	if err := t.Execute(body, struct{ Message string }{"Reset your password"}); err != nil {
		return richErrors.Wrap(err, "Failed executing template")
	}

	m := s.mailgun.NewMessage(
		"Obserfy <noreply@mail.obserfy.com>",
		"Reset your Obserfy password",
		"",
		email,
	)
	m.SetHtml(body.String())

	// The entire operation should not take longer than 30 seconds
	ctx, cancel := context.WithTimeout(context.Background(), time.Second*30)
	defer cancel()

	_, _, err = s.mailgun.Send(ctx, m)
	if err != nil {
		return richErrors.Wrap(err, "Failed sending email with mailgun")
	}
	return nil
}

func NewService() Service {
	return Service{
		mailgun.NewMailgun(
			os.Getenv("MAILGUN_DOMAIN"),
			os.Getenv("MAILGUN_API_KEY"),
		),
	}
}
