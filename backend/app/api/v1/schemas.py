from pydantic import BaseModel
from typing import List

class ReceiptItem(BaseModel):
    name: str
    quantity: int
    price: float

class Receipt(BaseModel):
    merchant: str
    date: str
    total: float
    items: List[ReceiptItem]