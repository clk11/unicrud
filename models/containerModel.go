package models

type Container struct {
	ID    uint   `gorm:"primaryKey" json:"id"`
	Name  string `gorm:"unique;not null" json:"name"`
	Tasks []Task `gorm:"foreignKey:ContainerID" json:"tasks"`
}
