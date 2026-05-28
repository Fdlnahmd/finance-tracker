package models

import (
	"time"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Transaction struct {
	ID         primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	UserID     primitive.ObjectID `bson:"user_id" json:"user_id"`
	CategoryID primitive.ObjectID `bson:"category_id" json:"category_id"`
	Type       string             `bson:"type" json:"type"`
	Amount     float64            `bson:"amount" json:"amount"`
	Note       string             `bson:"note,omitempty" json:"note,omitempty"`
	Date       time.Time          `bson:"date" json:"date"`
	CreatedAt  time.Time          `bson:"created_at" json:"created_at"`
}

type TransactionInput struct {
	CategoryID string  `json:"category_id" binding:"required"`
	Type       string  `json:"type" binding:"required,oneof=income expense"`
	Amount     float64 `json:"amount" binding:"required,gt=0"`
	Note       string  `json:"note"`
	Date       string  `json:"date" binding:"required"`
}
