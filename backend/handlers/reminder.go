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

func GetReminders(c *gin.Context) {
	userID, _ := primitive.ObjectIDFromHex(c.GetString("userID"))
	col := config.GetCollection("reminders")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	cursor, err := col.Find(ctx, bson.M{"user_id": userID})
	if err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "Gagal mengambil reminder")
		return
	}
	defer cursor.Close(ctx)

	var reminders []models.Reminder
	cursor.All(ctx, &reminders)
	if reminders == nil {
		reminders = []models.Reminder{}
	}
	utils.SuccessResponse(c, http.StatusOK, "", reminders)
}

func CreateReminder(c *gin.Context) {
	userID, _ := primitive.ObjectIDFromHex(c.GetString("userID"))
	var input models.ReminderInput
	if err := c.ShouldBindJSON(&input); err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Data tidak valid: "+err.Error())
		return
	}

	col := config.GetCollection("reminders")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	reminder := models.Reminder{
		ID:        primitive.NewObjectID(),
		UserID:    userID,
		Title:     input.Title,
		Message:   input.Message,
		Time:      input.Time,
		IsActive:  true,
		CreatedAt: time.Now(),
	}

	_, err := col.InsertOne(ctx, reminder)
	if err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "Gagal membuat reminder")
		return
	}
	utils.SuccessResponse(c, http.StatusCreated, "Reminder berhasil dibuat", reminder)
}

func UpdateReminder(c *gin.Context) {
	userID, _ := primitive.ObjectIDFromHex(c.GetString("userID"))
	reminderID, err := primitive.ObjectIDFromHex(c.Param("id"))
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "ID reminder tidak valid")
		return
	}

	var input models.ReminderInput
	if err := c.ShouldBindJSON(&input); err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Data tidak valid: "+err.Error())
		return
	}

	col := config.GetCollection("reminders")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	result, err := col.UpdateOne(ctx, bson.M{"_id": reminderID, "user_id": userID}, bson.M{
		"$set": bson.M{"title": input.Title, "message": input.Message, "time": input.Time},
	})
	if err != nil || result.MatchedCount == 0 {
		utils.ErrorResponse(c, http.StatusNotFound, "Reminder tidak ditemukan")
		return
	}
	utils.SuccessResponse(c, http.StatusOK, "Reminder diupdate", nil)
}

func ToggleReminder(c *gin.Context) {
	userID, _ := primitive.ObjectIDFromHex(c.GetString("userID"))
	reminderID, err := primitive.ObjectIDFromHex(c.Param("id"))
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "ID reminder tidak valid")
		return
	}

	col := config.GetCollection("reminders")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var reminder models.Reminder
	err = col.FindOne(ctx, bson.M{"_id": reminderID, "user_id": userID}).Decode(&reminder)
	if err != nil {
		utils.ErrorResponse(c, http.StatusNotFound, "Reminder tidak ditemukan")
		return
	}

	col.UpdateOne(ctx, bson.M{"_id": reminderID}, bson.M{"$set": bson.M{"is_active": !reminder.IsActive}})
	utils.SuccessResponse(c, http.StatusOK, "Reminder toggled", nil)
}

func DeleteReminder(c *gin.Context) {
	userID, _ := primitive.ObjectIDFromHex(c.GetString("userID"))
	reminderID, err := primitive.ObjectIDFromHex(c.Param("id"))
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "ID tidak valid")
		return
	}

	col := config.GetCollection("reminders")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	result, err := col.DeleteOne(ctx, bson.M{"_id": reminderID, "user_id": userID})
	if err != nil || result.DeletedCount == 0 {
		utils.ErrorResponse(c, http.StatusNotFound, "Reminder tidak ditemukan")
		return
	}
	utils.SuccessResponse(c, http.StatusOK, "Reminder dihapus", nil)
}
