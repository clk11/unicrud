package controllers

import (
	config "unicrud/database"
	"unicrud/models"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
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
		return c.Status(400).JSON(fiber.Map{
			"error": "Cannot parse JSON",
		})
	}

	var lastContainer models.Container
	if err := config.DB.Order("`index` DESC").Last(&lastContainer).Error; err != nil {
		if err.Error() != "record not found" {
			return c.Status(500).JSON(fiber.Map{
				"error": "Failed to fetch last container index",
			})
		}
		container.Index = 0
	} else {
		container.Index = lastContainer.Index + 1
	}

	if err := config.DB.Create(&container).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{
			"error": "Failed to create container",
		})
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

func DeleteContainer(c *fiber.Ctx) error {
	id := c.Params("id")

	var container models.Container
	if err := config.DB.First(&container, id).Error; err != nil {
		return c.Status(404).JSON(fiber.Map{"error": "Container not found"})
	}

	if err := config.DB.Delete(&container).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to delete container"})
	}

	if err := config.DB.Model(&models.Container{}).
		Where("`index` > ?", container.Index).
		Update("`index`", gorm.Expr("`index` - 1")).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to update container indices"})
	}

	return c.Status(200).JSON(fiber.Map{"message": "Container deleted successfully and indices updated"})
}
