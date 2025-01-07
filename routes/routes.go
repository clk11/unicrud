package routes

import (
	"unicrud/controllers"

	"github.com/gofiber/fiber/v2"
)

func TaskRoutes(app *fiber.App) {
	tasks := app.Group("/tasks")

	tasks.Get("/", controllers.GetAllTasks)
	tasks.Post("/", controllers.CreateTask)
	tasks.Put("/:id", controllers.UpdateTask)
	tasks.Delete("/:id", controllers.DeleteTask)
}
