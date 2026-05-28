package handlers

import (
	"context"
	"net/http"
	"strconv"
	"time"

	"finance-tracker-backend/config"
	"finance-tracker-backend/utils"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type CategoryBreakdown struct {
	CategoryID string  `json:"category_id"`
	Name       string  `json:"name"`
	Type       string  `json:"type"`
	Total      float64 `json:"total"`
	Color      string  `json:"color"`
	Icon       string  `json:"icon"`
}

type SummaryResponse struct {
	Month               int                 `json:"month"`
	Year                int                 `json:"year"`
	TotalIncome         float64             `json:"total_income"`
	TotalExpense        float64             `json:"total_expense"`
	Balance             float64             `json:"balance"`
	BreakdownByCategory []CategoryBreakdown `json:"breakdown_by_category"`
}

type TrendItem struct {
	Month        int     `json:"month"`
	Year         int     `json:"year"`
	TotalIncome  float64 `json:"total_income"`
	TotalExpense float64 `json:"total_expense"`
}

func GetSummary(c *gin.Context) {
	userID, _ := primitive.ObjectIDFromHex(c.GetString("userID"))
	monthStr := c.DefaultQuery("month", strconv.Itoa(int(time.Now().Month())))
	yearStr := c.DefaultQuery("year", strconv.Itoa(time.Now().Year()))
	month, _ := strconv.Atoi(monthStr)
	year, _ := strconv.Atoi(yearStr)

	// Check memory cache
	cacheKey := userID.Hex() + "-summary-" + monthStr + "-" + yearStr
	if cachedData, found := utils.GlobalCache.Get(cacheKey); found {
		if resp, ok := cachedData.(SummaryResponse); ok {
			utils.SuccessResponse(c, http.StatusOK, "", resp)
			return
		}
	}

	startDate := time.Date(year, time.Month(month), 1, 0, 0, 0, 0, time.UTC)
	endDate := startDate.AddDate(0, 1, 0)
	ctx, cancel := context.WithTimeout(context.Background(), 15*time.Second)
	defer cancel()

	txCol := config.GetCollection("transactions")

	cur, err := txCol.Aggregate(ctx, bson.A{
		bson.M{"$match": bson.M{"user_id": userID, "date": bson.M{"$gte": startDate, "$lt": endDate}}},
		bson.M{"$group": bson.M{"_id": "$type", "total": bson.M{"$sum": "$amount"}}},
	})
	if err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "Gagal menghitung ringkasan")
		return
	}
	var totals []bson.M
	cur.All(ctx, &totals)
	var totalIncome, totalExpense float64
	for _, r := range totals {
		t, _ := r["_id"].(string)
		v, _ := r["total"].(float64)
		if t == "income" {
			totalIncome = v
		} else {
			totalExpense = v
		}
	}

	cur2, err := txCol.Aggregate(ctx, bson.A{
		bson.M{"$match": bson.M{"user_id": userID, "date": bson.M{"$gte": startDate, "$lt": endDate}}},
		bson.M{"$group": bson.M{"_id": "$category_id", "total": bson.M{"$sum": "$amount"}, "type": bson.M{"$first": "$type"}}},
		bson.M{"$lookup": bson.M{"from": "categories", "localField": "_id", "foreignField": "_id", "as": "cat"}},
		bson.M{"$unwind": bson.M{"path": "$cat", "preserveNullAndEmptyArrays": true}},
		bson.M{"$project": bson.M{
			"category_id": bson.M{"$toString": "$_id"}, "name": bson.M{"$ifNull": bson.A{"$cat.name", "Unknown"}},
			"type": 1, "total": 1, "color": bson.M{"$ifNull": bson.A{"$cat.color", "#9CA3AF"}},
			"icon": bson.M{"$ifNull": bson.A{"$cat.icon", "📦"}},
		}},
		bson.M{"$sort": bson.M{"total": -1}},
	})
	if err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "Gagal breakdown")
		return
	}
	var bd []CategoryBreakdown
	cur2.All(ctx, &bd)
	if bd == nil {
		bd = []CategoryBreakdown{}
	}

	resp := SummaryResponse{
		Month: month, Year: year, TotalIncome: totalIncome, TotalExpense: totalExpense,
		Balance: totalIncome - totalExpense, BreakdownByCategory: bd,
	}

	// Save to memory cache for 5 minutes
	utils.GlobalCache.Set(cacheKey, resp, 5*time.Minute)

	utils.SuccessResponse(c, http.StatusOK, "", resp)
}

func GetTrend(c *gin.Context) {
	userID, _ := primitive.ObjectIDFromHex(c.GetString("userID"))
	months, _ := strconv.Atoi(c.DefaultQuery("months", "6"))
	if months <= 0 || months > 12 {
		months = 6
	}

	// Check memory cache
	cacheKey := userID.Hex() + "-trend-" + strconv.Itoa(months)
	if cachedData, found := utils.GlobalCache.Get(cacheKey); found {
		if resp, ok := cachedData.([]TrendItem); ok {
			utils.SuccessResponse(c, http.StatusOK, "", resp)
			return
		}
	}

	now := time.Now()
	startDate := time.Date(now.Year(), now.Month()-time.Month(months-1), 1, 0, 0, 0, 0, time.UTC)
	ctx, cancel := context.WithTimeout(context.Background(), 15*time.Second)
	defer cancel()

	cur, err := config.GetCollection("transactions").Aggregate(ctx, bson.A{
		bson.M{"$match": bson.M{"user_id": userID, "date": bson.M{"$gte": startDate}}},
		bson.M{"$group": bson.M{"_id": bson.M{"month": bson.M{"$month": "$date"}, "year": bson.M{"$year": "$date"}, "type": "$type"}, "total": bson.M{"$sum": "$amount"}}},
	})
	if err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "Gagal tren")
		return
	}
	var results []bson.M
	cur.All(ctx, &results)

	trendMap := make(map[string]*TrendItem)
	for i := 0; i < months; i++ {
		d := time.Date(now.Year(), now.Month()-time.Month(months-1-i), 1, 0, 0, 0, 0, time.UTC)
		key := strconv.Itoa(d.Year()) + "-" + strconv.Itoa(int(d.Month()))
		trendMap[key] = &TrendItem{Month: int(d.Month()), Year: d.Year()}
	}
	for _, r := range results {
		id := r["_id"].(bson.M)
		m := int(id["month"].(int32))
		y := int(id["year"].(int32))
		t := id["type"].(string)
		v := r["total"].(float64)
		key := strconv.Itoa(y) + "-" + strconv.Itoa(m)
		if item, ok := trendMap[key]; ok {
			if t == "income" {
				item.TotalIncome = v
			} else {
				item.TotalExpense = v
			}
		}
	}
	var trend []TrendItem
	for i := 0; i < months; i++ {
		d := time.Date(now.Year(), now.Month()-time.Month(months-1-i), 1, 0, 0, 0, 0, time.UTC)
		key := strconv.Itoa(d.Year()) + "-" + strconv.Itoa(int(d.Month()))
		trend = append(trend, *trendMap[key])
	}

	// Save to memory cache for 5 minutes
	utils.GlobalCache.Set(cacheKey, trend, 5*time.Minute)

	utils.SuccessResponse(c, http.StatusOK, "", trend)
}
