package domain

import "go.uber.org/zap"

type VideoService interface{}

func NewNoopVideoService(logger *zap.Logger) NoopVideoService {
	return NoopVideoService{
		logger: logger,
	}
}

type NoopVideoService struct {
	logger *zap.Logger
}
