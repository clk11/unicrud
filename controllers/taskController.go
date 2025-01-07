package controllers

import (
	config "unicrud/database"
	"unicrud/models"

	"github.com/gofiber/fiber/v2"
)

func isValidStatus(status string) bool {
	return status == string(models.StatusBacklog) ||
		status == string(models.StatusInProgress) ||
		status == string(models.StatusDone)
}

func GetAllTasks(c *fiber.Ctx) error {
	var tasks []models.Task
	if err := config.DB.Find(&tasks).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to fetch tasks"})
	}
	return c.JSON(tasks)
}

func CreateTask(c *fiber.Ctx) error {
	task := new(models.Task)
	if err := c.BodyParser(task); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Cannot parse JSON"})
	}

	if err := config.DB.Create(&task).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to create task"})
	}
	return c.JSON(task)
}

func UpdateTask(c *fiber.Ctx) error {
	id := c.Params("id")
	var task models.Task
	if err := config.DB.First(&task, id).Error; err != nil {
		return c.Status(404).JSON(fiber.Map{"error": "Task not found"})
	}

	if err := c.BodyParser(&task); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Cannot parse JSON"})
	}

	if !isValidStatus(string(task.Status)) {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid status value"})
	}

	if err := config.DB.Save(&task).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to update task"})
	}
	return c.JSON(task)
}

func DeleteTask(c *fiber.Ctx) error {
	id := c.Params("id")
	var task models.Task
	if err := config.DB.First(&task, id).Error; err != nil {
		return c.Status(404).JSON(fiber.Map{"error": "Task not found"})
	}

	if err := config.DB.Delete(&task).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to delete task"})
	}
	return c.SendStatus(204)
}
