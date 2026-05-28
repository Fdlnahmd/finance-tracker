package models

import "go.mongodb.org/mongo-driver/bson/primitive"

type Category struct {
	ID        primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	UserID    primitive.ObjectID `bson:"user_id" json:"user_id"`
	Name      string             `bson:"name" json:"name" binding:"required"`
	Type      string             `bson:"type" json:"type" binding:"required"`
	Icon      string             `bson:"icon,omitempty" json:"icon,omitempty"`
	Color     string             `bson:"color,omitempty" json:"color,omitempty"`
	IsDefault bool               `bson:"is_default" json:"is_default"`
}

type CategoryInput struct {
	Name  string `json:"name" binding:"required"`
	Type  string `json:"type" binding:"required,oneof=income expense"`
	Icon  string `json:"icon"`
	Color string `json:"color"`
}
