package main

import (
	"fmt"
	"net/http"

	"parallax-scrolling/internal/handlers"
)

func main() {
	// Раздаем все файлы из папки web/static
	fs := http.FileServer(http.Dir("./web/static"))
	http.Handle("/", fs)

	// Роут для получения статуса
	http.HandleFunc("/api/status", handlers.StatusHandler)

	fmt.Println("Сервер Fairy Forest запущен на порту :8080")
	// Запуск веб-сервера на стандартном порту
	err := http.ListenAndServe("localhost:8080", nil)
	if err != nil {
		fmt.Println("Ошибка:", err)
	}
}
