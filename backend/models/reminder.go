package models

import (
	"time"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Reminder struct {
	ID        primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	UserID    primitive.ObjectID `bson:"user_id" json:"user_id"`
	Title     string             `bson:"title" json:"title" binding:"required"`
	Message   string             `bson:"message" json:"message"`
	Time      string             `bson:"time" json:"time"`
	IsActive  bool               `bson:"is_active" json:"is_active"`
	CreatedAt time.Time          `bson:"created_at" json:"created_at"`
}

type ReminderInput struct {
	Title   string `json:"title" binding:"required"`
	Message string `json:"message"`
	Time    string `json:"time" binding:"required"`
}
