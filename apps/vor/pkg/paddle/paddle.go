package paddle

import (
	richErrors "github.com/pkg/errors"
	"go.uber.org/zap"
	"net/http"
	"net/url"
	"os"
	"strconv"
)

func UpdateSubscriptionUserCount(l zap.Logger, subscriptionId string, quantity int) error {
	updateUserApi := "https://vendors.paddle.com/api/2.0/subscription/users/update"
	vendorId, apiKey, err := getConfig()
	if err != nil {
		l.Warn("billing disabled, " + err.Error())
		return nil
	}

	// TODO: Update next bill amount
	_, err = http.PostForm(updateUserApi, url.Values{
		"vendor_id":        {vendorId},
		"vendor_auth_code": {apiKey},
		"subscription_id":  {subscriptionId},
		"quantity":         {strconv.Itoa(quantity)},
	})
	if err != nil {
		return richErrors.Wrap(err, "failed to update subscription details")
	}

	return nil
}

func getConfig() (string, string, error) {
	vendorId := os.Getenv("PADDLE_VENDOR_ID")
	apiKey := os.Getenv("PADDLE_API_KEY")
	if vendorId == "" || apiKey == "" {
		return "", "", richErrors.New("empty paddle creds")
	}

	return vendorId, apiKey, nil
}
