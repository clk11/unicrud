package controllers

import (
	config "unicrud/database"
	"unicrud/models"

	"github.com/gofiber/fiber/v2"
)

func GetAllContainers(c *fiber.Ctx) error {
	var containers []models.Container
	if err := config.DB.Find(&containers).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to fetch tasks"})
	}
	// We don't need to add the "Template" key bacause its defaulted to index
	return c.Render("layout", fiber.Map{
		"Containers": containers,
	})
}

func CreateContainer(c *fiber.Ctx) error {
	var container models.Container
	if err := c.BodyParser(&container); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Cannot parse JSON"})
	}
	if err := config.DB.Create(&container).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to create container"})
	}
	return c.Status(201).JSON(container)
}

func UpdateContainer(c *fiber.Ctx) error {
	id := c.Params("id")
	var container models.Container
	if err := config.DB.First(&container, id).Error; err != nil {
		return c.Status(404).JSON(fiber.Map{"error": "Container not found"})
	}

	if err := c.BodyParser(&container); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Cannot parse JSON"})
	}

	if err := config.DB.Save(&container).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to update container"})
	}
	return c.JSON(container)
}
