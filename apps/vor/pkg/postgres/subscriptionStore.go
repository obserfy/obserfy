package postgres

import (
	"github.com/chrsep/vor/pkg/domain"
	"github.com/go-pg/pg/v10"
	"github.com/google/uuid"
	richErrors "github.com/pkg/errors"
)

type SubscriptionStore struct {
	*pg.DB
}

func (s SubscriptionStore) SaveNewSubscription(schoolId string, subscription domain.Subscription) error {
	newSubscription := Subscription{
		Id:                 uuid.New(),
		CancelUrl:          subscription.CancelUrl,
		Currency:           subscription.Currency,
		Email:              subscription.Email,
		EventTime:          subscription.EventTime,
		MarketingConsent:   subscription.MarketingConsent,
		NextBillDate:       subscription.NextBillDate,
		Status:             subscription.Status,
		SubscriptionId:     subscription.SubscriptionId,
		SubscriptionPlanId: subscription.SubscriptionPlanId,
		PaddleUserId:       subscription.PaddleUserId,
		UpdateUrl:          subscription.UpdateUrl,
	}
	school := School{Id: schoolId, SubscriptionId: newSubscription.Id}

	if err := s.RunInTransaction(s.Context(), func(tx *pg.Tx) error {
		if _, err := s.Model(&newSubscription).Insert(); err != nil {
			return richErrors.Wrap(err, "failed to insert subscription")
		}
		if _, err := s.Model(&school).WherePK().UpdateNotZero(); err != nil {
			return richErrors.Wrap(err, "failed to insert subscription")
		}
		return nil
	}); err != nil {
		return err
	}

	return nil
}

func (s SubscriptionStore) DeleteSubscription(id string) error {
	var target Subscription
	if _, err := s.Model(&target).Where("subscription_id=?", id).Delete(); err != nil {
		return richErrors.Wrap(err, "failed to delete subscription")
	}
	return nil
}
