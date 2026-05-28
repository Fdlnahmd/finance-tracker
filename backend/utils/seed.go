package utils

import (
	"context"
	"log"
	"time"

	"finance-tracker-backend/config"
	"finance-tracker-backend/models"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type DefaultCategory struct {
	Name  string
	Type  string
	Icon  string
	Color string
}

var defaultCategories = []DefaultCategory{
	{Name: "Gaji", Type: "income", Icon: "💰", Color: "#22C55E"},
	{Name: "Freelance", Type: "income", Icon: "💻", Color: "#3B82F6"},
	{Name: "Investasi", Type: "income", Icon: "📈", Color: "#8B5CF6"},
	{Name: "Makan & Minum", Type: "expense", Icon: "🍜", Color: "#F97316"},
	{Name: "Transport", Type: "expense", Icon: "🚗", Color: "#EF4444"},
	{Name: "Belanja", Type: "expense", Icon: "🛍️", Color: "#EC4899"},
	{Name: "Hiburan", Type: "expense", Icon: "🎮", Color: "#F59E0B"},
	{Name: "Kesehatan", Type: "expense", Icon: "🏥", Color: "#14B8A6"},
	{Name: "Tagihan", Type: "expense", Icon: "📄", Color: "#6B7280"},
	{Name: "Lainnya", Type: "expense", Icon: "📦", Color: "#9CA3AF"},
}

func SeedDefaultCategories(userID primitive.ObjectID) {
	collection := config.GetCollection("categories")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var docs []interface{}
	for _, cat := range defaultCategories {
		docs = append(docs, models.Category{
			ID:        primitive.NewObjectID(),
			UserID:    userID,
			Name:      cat.Name,
			Type:      cat.Type,
			Icon:      cat.Icon,
			Color:     cat.Color,
			IsDefault: true,
		})
	}

	_, err := collection.InsertMany(ctx, docs)
	if err != nil {
		log.Println("⚠️ Failed to seed default categories:", err)
	}
}
