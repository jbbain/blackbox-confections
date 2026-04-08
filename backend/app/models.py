from sqlalchemy import String, Integer, Float, Boolean, DateTime, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime
from .db import Base

class Product(Base):
    __tablename__ = "products"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(200), nullable=False, index=True)
    description: Mapped[str] = mapped_column(Text, default="")
    price: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)
    image_url: Mapped[str] = mapped_column(String(5000), default="")
    category: Mapped[str] = mapped_column(String(120), default="Baked Goods")
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    image_scale: Mapped[float] = mapped_column(Float, default=1.0)
    image_x: Mapped[float] = mapped_column(Float, default=0.0)
    image_y: Mapped[float] = mapped_column(Float, default=0.0)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

class Order(Base):
    __tablename__ = "orders"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    customer_name: Mapped[str] = mapped_column(String(200), nullable=False)
    customer_email: Mapped[str] = mapped_column(String(200), nullable=False, index=True)
    customer_phone: Mapped[str] = mapped_column(String(80), default="")
    event_type: Mapped[str] = mapped_column(String(120), default="")
    dessert_type: Mapped[str] = mapped_column(String(120), default="")
    servings: Mapped[str] = mapped_column(String(80), default="")
    event_date: Mapped[str] = mapped_column(String(80), default="")
    pickup_or_delivery: Mapped[str] = mapped_column(String(30), default="pickup")
    color_theme: Mapped[str] = mapped_column(String(255), default="")
    flavor_preferences: Mapped[str] = mapped_column(String(255), default="")
    inspiration_notes: Mapped[str] = mapped_column(Text, default="")
    status: Mapped[str] = mapped_column(String(30), default="new")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

class Review(Base):
    __tablename__ = "reviews"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    rating: Mapped[int] = mapped_column(Integer, default=5)
    message: Mapped[str] = mapped_column(Text, nullable=False)
    approved: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

class GalleryItem(Base):
    __tablename__ = "gallery"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    image_url: Mapped[str] = mapped_column(String(500), nullable=False)
    caption: Mapped[str] = mapped_column(String(240), default="")
    sort_order: Mapped[int] = mapped_column(Integer, default=0)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

class ContactMessage(Base):
    __tablename__ = "contact_messages"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    email: Mapped[str] = mapped_column(String(200), nullable=False)
    phone: Mapped[str] = mapped_column(String(80), default="")
    subject: Mapped[str] = mapped_column(String(200), default="General Inquiry")
    message: Mapped[str] = mapped_column(Text, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

class PageVisit(Base):
    __tablename__ = "page_visits"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    page: Mapped[str] = mapped_column(String(200), nullable=False, index=True)
    visited_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)