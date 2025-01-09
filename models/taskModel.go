package models

import "time"

type TaskStatus string

const (
	StatusBacklog    TaskStatus = "backlog"
	StatusInProgress TaskStatus = "in_progress"
	StatusDone       TaskStatus = "done"
)

type Task struct {
	ID          uint       `gorm:"primaryKey" json:"id"`
	Title       string     `json:"title"`
	Description string     `json:"description"`
	Status      TaskStatus `gorm:"default:backlog" json:"status"`
	Date        time.Time  `gorm:"autoCreateTime" json:"date"`
}
