package models

import "time"

type Task struct {
	ID          uint      `gorm:"primaryKey" json:"id"`
	Title       string    `json:"title"`
	ContainerID uint      `gorm:"not null" json:"status_id"`
	Container   Container `gorm:"constraint:OnUpdate:CASCADE,OnDelete:SET NULL;" json:"status"`
	Date        time.Time `gorm:"autoCreateTime" json:"date"`
}
