package routes

import (
	"unicrud/controllers"

	"github.com/gofiber/fiber/v2"
)

func TaskRoutes(app *fiber.App) {
	app.Get("/", func(c *fiber.Ctx) error {
		return c.Redirect("/board")
	})
	board := app.Group("/board")
	board.Get("/", controllers.GetAllContainers)
	board.Post("/task", controllers.CreateTask)
	board.Post("/container", controllers.CreateContainer)
	board.Put("/task/:id", controllers.UpdateTask)
	board.Put("/container/:id", controllers.UpdateContainer)
	board.Delete("/task/:id", controllers.DeleteTask)
}
