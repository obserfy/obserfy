package mailgun

import (
	"bytes"
	"context"
	"html/template"
	"os"
	"time"

	"github.com/mailgun/mailgun-go/v4"
	richErrors "github.com/pkg/errors"
)

type Service struct {
	mailgun mailgun.Mailgun
}

func (s Service) SendInviteEmail(email string, inviteCode string, schoolName string) error {
	t, err := template.ParseFiles("./mailTemplates/send-invite.html")
	if err != nil {
		return richErrors.Wrap(err, "Failed parsing send-invite.html")
	}
	body := new(bytes.Buffer)
	url := "https://" + os.Getenv("SITE_URL") + "/register?inviteCode=" + inviteCode
	if err := t.Execute(body, struct {
		SchoolName string
		InviteUrl  string
	}{SchoolName: schoolName, InviteUrl: url}); err != nil {
		return richErrors.Wrap(err, "Failed executing template")
	}

	m := s.mailgun.NewMessage(
		"Obserfy <noreply@mail.obserfy.com>",
		"You have been invited",
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

func (s Service) SendPasswordResetSuccessful(email string) error {
	t, err := template.ParseFiles("./mailTemplates/reset-password-success.html")
	if err != nil {
		return richErrors.Wrap(err, "Failed parsing reset-password.html")
	}
	body := new(bytes.Buffer)
	if err := t.Execute(body, nil); err != nil {
		return richErrors.Wrap(err, "Failed executing template")
	}

	m := s.mailgun.NewMessage(
		"Obserfy <noreply@mail.obserfy.com>",
		"Your password has been changed",
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

func (s Service) SendResetPassword(email string, token string) error {
	t, err := template.ParseFiles("./mailTemplates/reset-password.html")
	if err != nil {
		return richErrors.Wrap(err, "Failed parsing reset-password.html")
	}
	body := new(bytes.Buffer)
	url := "https://" + os.Getenv("SITE_URL") + "/reset-password?token=" + token
	if err := t.Execute(body, struct{ Url string }{url}); err != nil {
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
