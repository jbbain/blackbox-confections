from pydantic import BaseModel, Field, EmailStr
from datetime import datetime
from typing import List, Optional

# -----------------
# Products
# -----------------
class ProductBase(BaseModel):
    name: str = Field(..., max_length=200)
    description: str = ""
    price: float = Field(..., ge=0)
    image_url: str = ""
    category: str = "Baked Goods"
    is_active: bool = True

class ProductCreate(ProductBase):
    pass

class ProductUpdate(BaseModel):
    name: Optional[str] = Field(None, max_length=200)
    description: Optional[str] = None
    price: Optional[float] = Field(None, ge=0)
    image_url: Optional[str] = None
    category: Optional[str] = None
    is_active: Optional[bool] = None

class ProductOut(ProductBase):
    id: int
    created_at: datetime
    class Config:
        from_attributes = True

# -----------------
# Orders
# -----------------
class OrderItemIn(BaseModel):
    product_id: int
    quantity: int = Field(1, ge=1)

class OrderItemOut(BaseModel):
    id: int
    product_id: int
    quantity: int
    unit_price: float
    product_name: Optional[str] = None
    class Config:
        from_attributes = True

class OrderBase(BaseModel):
    customer_name: str
    customer_email: EmailStr
    customer_phone: str = ""
    fulfillment_type: str = Field("pickup", pattern="^(pickup|delivery)$")
    address: str = ""
    notes: str = ""

class OrderCreate(OrderBase):
    items: List[OrderItemIn]

class OrderUpdate(BaseModel):
    customer_name: Optional[str] = None
    customer_email: Optional[EmailStr] = None
    customer_phone: Optional[str] = None
    fulfillment_type: Optional[str] = Field(None, pattern="^(pickup|delivery)$")
    address: Optional[str] = None
    notes: Optional[str] = None
    status: Optional[str] = Field(None, pattern="^(new|in_progress|ready|completed|cancelled)$")

class OrderOut(OrderBase):
    id: int
    status: str
    total: float
    created_at: datetime
    items: List[OrderItemOut] = []
    class Config:
        from_attributes = True

# -----------------
# Reviews
# -----------------
class ReviewBase(BaseModel):
    name: str
    rating: int = Field(5, ge=1, le=5)
    message: str
    approved: bool = True

class ReviewCreate(ReviewBase):
    pass

class ReviewUpdate(BaseModel):
    name: Optional[str] = None
    rating: Optional[int] = Field(None, ge=1, le=5)
    message: Optional[str] = None
    approved: Optional[bool] = None

class ReviewOut(ReviewBase):
    id: int
    created_at: datetime
    class Config:
        from_attributes = True

# -----------------
# Gallery
# -----------------
class GalleryBase(BaseModel):
    image_url: str
    caption: str = ""
    sort_order: int = 0

class GalleryCreate(GalleryBase):
    pass

class GalleryUpdate(BaseModel):
    image_url: Optional[str] = None
    caption: Optional[str] = None
    sort_order: Optional[int] = None

class GalleryOut(GalleryBase):
    id: int
    created_at: datetime
    class Config:
        from_attributes = True

# -----------------
# Contact
# -----------------
class ContactCreate(BaseModel):
    name: str
    email: EmailStr
    subject: str = "Inquiry"
    message: str

class ContactOut(ContactCreate):
    id: int
    created_at: datetime
    class Config:
        from_attributes = True
