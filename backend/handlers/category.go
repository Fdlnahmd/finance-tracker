package handlers

import (
	"context"
	"net/http"
	"time"

	"finance-tracker-backend/config"
	"finance-tracker-backend/models"
	"finance-tracker-backend/utils"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func GetCategories(c *gin.Context) {
	userID, _ := primitive.ObjectIDFromHex(c.GetString("userID"))
	collection := config.GetCollection("categories")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	cursor, err := collection.Find(ctx, bson.M{"user_id": userID})
	if err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "Gagal mengambil kategori")
		return
	}
	defer cursor.Close(ctx)

	var categories []models.Category
	if err := cursor.All(ctx, &categories); err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "Gagal membaca data kategori")
		return
	}

	if categories == nil {
		categories = []models.Category{}
	}

	utils.SuccessResponse(c, http.StatusOK, "", categories)
}

func CreateCategory(c *gin.Context) {
	userID, _ := primitive.ObjectIDFromHex(c.GetString("userID"))

	var input models.CategoryInput
	if err := c.ShouldBindJSON(&input); err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Data tidak valid: "+err.Error())
		return
	}

	collection := config.GetCollection("categories")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	category := models.Category{
		ID:        primitive.NewObjectID(),
		UserID:    userID,
		Name:      input.Name,
		Type:      input.Type,
		Icon:      input.Icon,
		Color:     input.Color,
		IsDefault: false,
	}

	_, err := collection.InsertOne(ctx, category)
	if err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "Gagal membuat kategori")
		return
	}

	utils.SuccessResponse(c, http.StatusCreated, "Kategori berhasil dibuat", category)
}

func UpdateCategory(c *gin.Context) {
	userID, _ := primitive.ObjectIDFromHex(c.GetString("userID"))
	categoryID, err := primitive.ObjectIDFromHex(c.Param("id"))
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "ID kategori tidak valid")
		return
	}

	var input models.CategoryInput
	if err := c.ShouldBindJSON(&input); err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Data tidak valid: "+err.Error())
		return
	}

	collection := config.GetCollection("categories")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	filter := bson.M{"_id": categoryID, "user_id": userID}
	update := bson.M{
		"$set": bson.M{
			"name":  input.Name,
			"type":  input.Type,
			"icon":  input.Icon,
			"color": input.Color,
		},
	}

	result, err := collection.UpdateOne(ctx, filter, update)
	if err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "Gagal mengupdate kategori")
		return
	}

	if result.MatchedCount == 0 {
		utils.ErrorResponse(c, http.StatusNotFound, "Kategori tidak ditemukan")
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "Kategori berhasil diupdate", nil)
}

func DeleteCategory(c *gin.Context) {
	userID, _ := primitive.ObjectIDFromHex(c.GetString("userID"))
	categoryID, err := primitive.ObjectIDFromHex(c.Param("id"))
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "ID kategori tidak valid")
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	txCollection := config.GetCollection("transactions")
	count, err := txCollection.CountDocuments(ctx, bson.M{
		"category_id": categoryID,
		"user_id":     userID,
	})
	if err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "Gagal mengecek transaksi terkait")
		return
	}
	if count > 0 {
		utils.ErrorResponse(c, http.StatusConflict, "Tidak bisa menghapus kategori yang masih memiliki transaksi")
		return
	}

	collection := config.GetCollection("categories")
	result, err := collection.DeleteOne(ctx, bson.M{"_id": categoryID, "user_id": userID})
	if err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "Gagal menghapus kategori")
		return
	}

	if result.DeletedCount == 0 {
		utils.ErrorResponse(c, http.StatusNotFound, "Kategori tidak ditemukan")
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "Kategori berhasil dihapus", nil)
}
