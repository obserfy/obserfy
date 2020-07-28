package subscription

import (
	"bytes"
	"crypto"
	"crypto/rsa"
	"crypto/sha1"
	"crypto/x509"
	"encoding/base64"
	"encoding/json"
	"encoding/pem"
	"github.com/chrsep/vor/pkg/rest"
	"github.com/go-chi/chi"
	"github.com/google/uuid"
	richErrors "github.com/pkg/errors"
	"net/http"
	"net/url"
	"os"
	"sort"
	"strconv"
	"time"
)

func NewRouter(server rest.Server, store Store) *chi.Mux {
	r := chi.NewRouter()
	r.Method("POST", "/", postWebhook(server, store))
	return r
}

func postWebhook(server rest.Server, store Store) http.Handler {
	return server.NewHandler(func(w http.ResponseWriter, r *http.Request) *rest.Error {
		if err := r.ParseForm(); err != nil {
			return &rest.Error{
				Code:    http.StatusBadRequest,
				Message: "invalid form",
				Error:   err,
			}
		}

		if err := verifySignature(r.Form, os.Getenv("PADDLE_PUBLIC_KEY")); err != nil {
			return &rest.Error{
				Code:    http.StatusUnauthorized,
				Message: "invalid signature",
				Error:   err,
			}
		}

		alertName := r.FormValue("alert_name")
		if alertName == "subscription_created" {
			return handleSubscriptionCreated(r.Form, store)
		} else if alertName == "subscription_updated" {
			return handleSubscriptionUpdated(r.Form, store)
		} else if alertName == "subscription_cancelled" {
			return handleSubscriptionCancelled(r.Form, store)
		} else {
			return &rest.Error{
				Code:    http.StatusBadRequest,
				Message: "unrecognized alert_name",
				Error:   richErrors.New(alertName + " is not a valid alert_name"),
			}
		}
	})
}

func handleSubscriptionCreated(values url.Values, store Store) *rest.Error {
	eventTime, err := time.Parse("2006-01-02 15:04:05", values.Get("event_time"))
	if err != nil {
		return &rest.Error{
			Code:    0,
			Message: "invalid event_time",
			Error:   richErrors.Wrapf(err, "failed to parse event time"),
		}
	}

	nextBillDate, err := time.Parse("2006-01-02", values.Get("next_bill_date"))

	var marketingConsent bool
	parsedMarketingConsent, err := strconv.ParseInt(values.Get("marketing_consent"), 10, 32)
	if err != nil {
		return &rest.Error{
			Code:    http.StatusBadRequest,
			Message: "failed to parse marketing consent",
			Error:   err,
		}
	}
	marketingConsent = parsedMarketingConsent == 1

	var passthroughs struct {
		SchoolId string `json:"schoolId"`
	}
	if err := json.Unmarshal([]byte(values.Get("passthrough")), &passthroughs); err != nil {
		return &rest.Error{
			Code:    http.StatusBadRequest,
			Message: "invalid passthrough value",
			Error:   err,
		}
	}
	if _, err := uuid.Parse(passthroughs.SchoolId); err != nil {
		return &rest.Error{
			Code:    http.StatusBadRequest,
			Message: "invalid school id",
			Error:   err,
		}
	}

	subscription := Subscription{
		CancelUrl:          values.Get("cancel_url"),
		Currency:           values.Get("currency"),
		Email:              values.Get("email"),
		EventTime:          eventTime,
		NextBillDate:       nextBillDate,
		Status:             values.Get("status"),
		SubscriptionId:     values.Get("subscription_id"),
		SubscriptionPlanId: values.Get("subscription_plan_id"),
		PaddleUserId:       values.Get("user_id"),
		UpdateUrl:          values.Get("update_url"),
		MarketingConsent:   marketingConsent,
	}

	if err := store.SaveNewSubscription(passthroughs.SchoolId, subscription); err != nil {
		return &rest.Error{
			Code:    http.StatusInternalServerError,
			Message: "failed to save subscription",
			Error:   err,
		}
	}

	return nil
}

func handleSubscriptionUpdated(form url.Values, store Store) *rest.Error {
	return nil
}

func handleSubscriptionCancelled(form url.Values, store Store) *rest.Error {
	return nil
}

// verifySignature verifies the p_signature parameter sent
// in Paddle webhooks. 'values' is the decoded form values sent
// in the webhook response body. You can get 'values' from a
// http.Request by calling request.Form
func verifySignature(values url.Values, publicKeyPEM string) error {
	der, _ := pem.Decode([]byte(publicKeyPEM))
	if der == nil {
		return richErrors.New("Could not parse public key pem")
	}

	pub, err := x509.ParsePKIXPublicKey(der.Bytes)
	if err != nil {
		return richErrors.New("Could not parse public key pem der")
	}

	signingKey, ok := pub.(*rsa.PublicKey)
	if !ok {
		return richErrors.New("Not the correct key format")
	}

	sig, err := base64.StdEncoding.DecodeString(values.Get("p_signature"))
	if err != nil {
		return richErrors.New("failed decoding signature")
	}

	// Delete p_signature
	values.Del("p_signature")

	// Sort the keys
	sortedKeys := make([]string, 0, len(values))
	for k := range values {
		sortedKeys = append(sortedKeys, k)
	}
	sort.Strings(sortedKeys)

	// Php Serialize in sorted order
	var sbuf bytes.Buffer
	sbuf.WriteString("a:")
	sbuf.WriteString(strconv.Itoa(len(sortedKeys)))
	sbuf.WriteString(":{")
	encodeString := func(s string) {
		sbuf.WriteString("s:")
		sbuf.WriteString(strconv.Itoa(len(s)))
		sbuf.WriteString(":\"")
		sbuf.WriteString(s)
		sbuf.WriteString("\";")
	}
	for _, k := range sortedKeys {
		encodeString(k)
		encodeString(values.Get(k))
	}
	sbuf.WriteString("}")

	sha1Sum := sha1.Sum(sbuf.Bytes())
	err = rsa.VerifyPKCS1v15(signingKey, crypto.SHA1, sha1Sum[:], sig)
	if err != nil {
		return err
	}

	return nil
}

type Subscription struct {
	Id                 uuid.UUID
	CancelUrl          string
	Currency           string
	Email              string
	EventTime          time.Time
	NextBillDate       time.Time
	Status             string
	SubscriptionId     string
	SubscriptionPlanId string
	PaddleUserId       string
	UpdateUrl          string
	MarketingConsent   bool
}

type Store interface {
	SaveNewSubscription(schoolId string, subscription Subscription) error
}
