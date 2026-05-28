package routes

import (
	"finance-tracker-backend/handlers"
	"finance-tracker-backend/middleware"

	"github.com/gin-gonic/gin"
)

func SetupRoutes(r *gin.Engine) {
	api := r.Group("/api")

	auth := api.Group("/auth")
	{
		auth.POST("/register", handlers.Register)
		auth.POST("/login", handlers.Login)
	}

	protected := api.Group("")
	protected.Use(middleware.AuthMiddleware())
	{
		categories := protected.Group("/categories")
		{
			categories.GET("", handlers.GetCategories)
			categories.POST("", handlers.CreateCategory)
			categories.PUT("/:id", handlers.UpdateCategory)
			categories.DELETE("/:id", handlers.DeleteCategory)
		}

		transactions := protected.Group("/transactions")
		{
			transactions.GET("", handlers.GetTransactions)
			transactions.POST("", handlers.CreateTransaction)
			transactions.PUT("/:id", handlers.UpdateTransaction)
			transactions.DELETE("/:id", handlers.DeleteTransaction)
		}

		protected.GET("/summary", handlers.GetSummary)
		protected.GET("/summary/trend", handlers.GetTrend)

		reminders := protected.Group("/reminders")
		{
			reminders.GET("", handlers.GetReminders)
			reminders.POST("", handlers.CreateReminder)
			reminders.PUT("/:id", handlers.UpdateReminder)
			reminders.PATCH("/:id/toggle", handlers.ToggleReminder)
			reminders.DELETE("/:id", handlers.DeleteReminder)
		}
	}
}
