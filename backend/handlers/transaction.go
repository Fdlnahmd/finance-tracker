package handlers

import (
	"context"
	"net/http"
	"strconv"
	"time"

	"finance-tracker-backend/config"
	"finance-tracker-backend/models"
	"finance-tracker-backend/utils"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func GetTransactions(c *gin.Context) {
	userID, _ := primitive.ObjectIDFromHex(c.GetString("userID"))
	collection := config.GetCollection("transactions")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	filter := bson.M{"user_id": userID}

	if typeFilter := c.Query("type"); typeFilter != "" {
		filter["type"] = typeFilter
	}

	if monthStr := c.Query("month"); monthStr != "" {
		if yearStr := c.Query("year"); yearStr != "" {
			month, _ := strconv.Atoi(monthStr)
			year, _ := strconv.Atoi(yearStr)
			startDate := time.Date(year, time.Month(month), 1, 0, 0, 0, 0, time.UTC)
			endDate := startDate.AddDate(0, 1, 0)
			filter["date"] = bson.M{
				"$gte": startDate,
				"$lt":  endDate,
			}
		}
	}

	opts := options.Find().SetSort(bson.D{{Key: "date", Value: -1}})

	cursor, err := collection.Find(ctx, filter, opts)
	if err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "Gagal mengambil transaksi")
		return
	}
	defer cursor.Close(ctx)

	var transactions []models.Transaction
	if err := cursor.All(ctx, &transactions); err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "Gagal membaca data transaksi")
		return
	}

	if transactions == nil {
		transactions = []models.Transaction{}
	}

	utils.SuccessResponse(c, http.StatusOK, "", transactions)
}

func CreateTransaction(c *gin.Context) {
	userID, _ := primitive.ObjectIDFromHex(c.GetString("userID"))

	var input models.TransactionInput
	if err := c.ShouldBindJSON(&input); err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Data tidak valid: "+err.Error())
		return
	}

	categoryID, err := primitive.ObjectIDFromHex(input.CategoryID)
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Category ID tidak valid")
		return
	}

	date, err := time.Parse("2006-01-02", input.Date)
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Format tanggal tidak valid (gunakan YYYY-MM-DD)")
		return
	}

	collection := config.GetCollection("transactions")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	catCollection := config.GetCollection("categories")
	catCount, _ := catCollection.CountDocuments(ctx, bson.M{"_id": categoryID, "user_id": userID})
	if catCount == 0 {
		utils.ErrorResponse(c, http.StatusBadRequest, "Kategori tidak ditemukan")
		return
	}

	transaction := models.Transaction{
		ID:         primitive.NewObjectID(),
		UserID:     userID,
		CategoryID: categoryID,
		Type:       input.Type,
		Amount:     input.Amount,
		Note:       input.Note,
		Date:       date,
		CreatedAt:  time.Now(),
	}

	_, err = collection.InsertOne(ctx, transaction)
	if err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "Gagal membuat transaksi")
		return
	}

	utils.SuccessResponse(c, http.StatusCreated, "Transaksi berhasil dibuat", transaction)
}

func UpdateTransaction(c *gin.Context) {
	userID, _ := primitive.ObjectIDFromHex(c.GetString("userID"))
	transactionID, err := primitive.ObjectIDFromHex(c.Param("id"))
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "ID transaksi tidak valid")
		return
	}

	var input models.TransactionInput
	if err := c.ShouldBindJSON(&input); err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Data tidak valid: "+err.Error())
		return
	}

	categoryID, err := primitive.ObjectIDFromHex(input.CategoryID)
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Category ID tidak valid")
		return
	}

	date, err := time.Parse("2006-01-02", input.Date)
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Format tanggal tidak valid")
		return
	}

	collection := config.GetCollection("transactions")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	filter := bson.M{"_id": transactionID, "user_id": userID}
	update := bson.M{
		"$set": bson.M{
			"category_id": categoryID,
			"type":        input.Type,
			"amount":      input.Amount,
			"note":        input.Note,
			"date":        date,
		},
	}

	result, err := collection.UpdateOne(ctx, filter, update)
	if err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "Gagal mengupdate transaksi")
		return
	}

	if result.MatchedCount == 0 {
		utils.ErrorResponse(c, http.StatusNotFound, "Transaksi tidak ditemukan")
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "Transaksi berhasil diupdate", nil)
}

func DeleteTransaction(c *gin.Context) {
	userID, _ := primitive.ObjectIDFromHex(c.GetString("userID"))
	transactionID, err := primitive.ObjectIDFromHex(c.Param("id"))
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "ID transaksi tidak valid")
		return
	}

	collection := config.GetCollection("transactions")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	result, err := collection.DeleteOne(ctx, bson.M{"_id": transactionID, "user_id": userID})
	if err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "Gagal menghapus transaksi")
		return
	}

	if result.DeletedCount == 0 {
		utils.ErrorResponse(c, http.StatusNotFound, "Transaksi tidak ditemukan")
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "Transaksi berhasil dihapus", nil)
}
