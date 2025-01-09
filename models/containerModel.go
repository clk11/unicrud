package models

type Container struct {
	ID    uint   `gorm:"primaryKey" json:"id"`
	Title string `gorm:"unique;not null" json:"title"`
	Index int    `gorm:"not null" json:"index"`
	Tasks []Task `gorm:"foreignKey:ContainerID" json:"tasks"`
}