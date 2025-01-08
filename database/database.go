package config

import (
	"log"
	"unicrud/models"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConnectDatabase() {
	var err error
	DB, err = gorm.Open(sqlite.Open("tasksmanager.db"), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to the database!")
	}

	err = DB.AutoMigrate(&models.Task{})
	if err != nil {
		log.Fatal("Failed to migrate database!")
	}

	log.Println("Database connection successfully established!")
}
