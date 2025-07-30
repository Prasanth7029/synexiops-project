package model

type Inventory struct {
	ID       int    `json:"id"`
	Name     string `json:"name"`
	SKU      string `json:"sku"`
	Quantity int    `json:"quantity"`
}
