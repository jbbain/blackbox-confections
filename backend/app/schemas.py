from pydantic import BaseModel, Field, EmailStr
from datetime import datetime
from typing import Optional

class ProductBase(BaseModel):
    name: str = Field(..., max_length=200)
    description: str = ""
    price: float = Field(..., ge=0)
    image_url: str = ""
    category: str = "Baked Goods"
    is_active: bool = True
    image_scale: float = Field(1.0, gt=0)
    image_x: float = 0.0
    image_y: float = 0.0

class ProductCreate(ProductBase):
    pass

class ProductUpdate(BaseModel):
    name: Optional[str] = Field(None, max_length=200)
    description: Optional[str] = None
    price: Optional[float] = Field(None, ge=0)
    image_url: Optional[str] = None
    category: Optional[str] = None
    is_active: Optional[bool] = None
    image_scale: Optional[float] = Field(None, gt=0)
    image_x: Optional[float] = None
    image_y: Optional[float] = None

class ProductOut(ProductBase):
    id: int
    created_at: datetime
    class Config:
        from_attributes = True

class OrderBase(BaseModel):
    customer_name: str
    customer_email: EmailStr
    customer_phone: str = ""
    event_type: str = ""
    dessert_type: str = ""
    servings: str = ""
    event_date: str = ""
    pickup_or_delivery: str = "pickup"
    color_theme: str = ""
    flavor_preferences: str = ""
    inspiration_notes: str = ""

class OrderCreate(OrderBase):
    pass

class OrderUpdate(BaseModel):
    customer_name: Optional[str] = None
    customer_email: Optional[EmailStr] = None
    customer_phone: Optional[str] = None
    event_type: Optional[str] = None
    dessert_type: Optional[str] = None
    servings: Optional[str] = None
    event_date: Optional[str] = None
    pickup_or_delivery: Optional[str] = None
    color_theme: Optional[str] = None
    flavor_preferences: Optional[str] = None
    inspiration_notes: Optional[str] = None
    status: Optional[str] = Field(None, pattern="^(new|in_progress|ready|completed|cancelled)$")

class OrderOut(OrderBase):
    id: int
    status: str
    created_at: datetime
    class Config:
        from_attributes = True

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