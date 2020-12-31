package domain

import "go.uber.org/zap"

type BillingService interface {
	UpdateSubscriptionQty(subscriptionId string, quantity int) error
}

func NewNoopBillingService(logger *zap.Logger) NoopBillingService {
	return NoopBillingService{
		logger: logger,
	}
}

type NoopBillingService struct {
	logger *zap.Logger
}

func (s NoopBillingService) UpdateSubscriptionQty(subscriptionId string, quantity int) error {
	return nil
}
