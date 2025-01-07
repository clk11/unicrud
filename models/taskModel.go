package models

import "time"

type TaskStatus string

const (
	StatusBacklog    TaskStatus = "Backlog"
	StatusInProgress TaskStatus = "In Progress"
	StatusDone       TaskStatus = "Done"
)

type Task struct {
	ID          uint       `gorm:"primaryKey" json:"id"`
	Title       string     `json:"title"`
	Description string     `json:"description"`
	Status      TaskStatus `json:"status"`
	Date        time.Time  `json:"date"`
}
