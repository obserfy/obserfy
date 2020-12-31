package paddle

import (
	richErrors "github.com/pkg/errors"
	"go.uber.org/zap"
	"net/http"
	"net/url"
	"os"
	"strconv"
)

// NewBillingService creates a new paddle.BillingService
func NewBillingService(logger *zap.Logger) (BillingService, error) {
	vendorId := os.Getenv("PADDLE_VENDOR_ID")
	apiKey := os.Getenv("PADDLE_API_KEY")

	if vendorId == "" || apiKey == "" {
		return BillingService{}, richErrors.New("empty paddle credentials")
	}

	return BillingService{
		vendorId: vendorId,
		apiKey:   apiKey,
		logger:   logger,
	}, nil
}

// BillingService implements domain.BillingService that's powered by paddle.
type BillingService struct {
	vendorId string
	apiKey   string
	logger   *zap.Logger
}

// UpdateSubscriptionQty changes the subscription qty saved on paddle.
func (s BillingService) UpdateSubscriptionQty(subscriptionId string, quantity int) error {
	updateUserApi := "https://vendors.paddle.com/api/2.0/subscription/users/update"

	_, err := http.PostForm(updateUserApi, url.Values{
		"vendor_id":        {s.vendorId},
		"vendor_auth_code": {s.apiKey},
		"subscription_id":  {subscriptionId},
		"quantity":         {strconv.Itoa(quantity)},
	})
	if err != nil {
		return richErrors.Wrap(err, "failed to update subscription details")
	}

	return nil
}
