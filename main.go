package main

import (
	config "unicrud/database"
	"unicrud/routes"

	"log"

	"github.com/gofiber/fiber/v2"
)

func main() {
	app := fiber.New()

	config.ConnectDatabase()

	app.Static("/static", "./static")

	routes.TaskRoutes(app)

	log.Fatal(app.Listen(":3000"))
}
