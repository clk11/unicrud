package main

import (
	config "unicrud/database"
	"unicrud/routes"

	"log"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/template/html/v2"
)

func main() {
	engine := html.New("./views", ".html")

	app := fiber.New(fiber.Config{
		Views: engine,
	})

	config.ConnectDatabase()

	app.Static("/static", "./static")

	routes.TaskRoutes(app)

	log.Fatal(app.Listen(":3000"))
}
