package main

import (
	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
	"log"
	"os"
)

func createLogger() *zap.Logger {
	var config zap.Config
	if os.Getenv("env") == "production" {
		config = zap.NewProductionConfig()
		config.Level.SetLevel(zap.InfoLevel)
	} else {
		config = zap.NewDevelopmentConfig()
		config.EncoderConfig.EncodeLevel = zapcore.CapitalColorLevelEncoder
	}

	logger, err := config.Build()
	if err != nil {
		log.Print("Failed creating logger")
	}
	return logger
}

func syncLogger(logger *zap.Logger) {
	err := logger.Sync()
	if err != nil {
		logger.Error("Failed logger sync: %s", zap.Error(err))
	}
}
