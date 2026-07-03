package handlers

import (
	"encoding/json"
	"fairy-forest/internal/models"
	"fairy-forest/internal/services"
	"net/http"
	"os"
)

func StatusHandler(w http.ResponseWriter, r *http.Request) {
	// Считываем IP-адреса и порты из переменных окружения
	mcIP := os.Getenv("MC_IP")
	mcPort := os.Getenv("MC_PORT")
	dndIP := os.Getenv("DND_IP")
	dndPort := os.Getenv("DND_PORT")

	// Устанавливаем дефолтные порты на случай, если в настройках они не будут указаны
	if mcPort == "" {
		mcPort = "25565"
	}
	if dndPort == "" {
		dndPort = "30100"
	}

	// Проверяем статусы
	mcStatus := services.CheckPort(mcIP, mcPort)
	dndStatus := services.CheckPort(dndIP, dndPort)

	status := models.ServerStatus{
		Minecraft: mcStatus,
		DnD:       dndStatus,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(status)
}
