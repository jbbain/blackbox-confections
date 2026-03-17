from sqlalchemy.orm import Session
from sqlalchemy import select
from . import models, schemas

def list_products(db: Session, active_only: bool = False):
    stmt = select(models.Product).order_by(models.Product.created_at.desc())
    if active_only:
        stmt = stmt.where(models.Product.is_active == True)  # noqa
    return db.scalars(stmt).all()

def get_product(db: Session, product_id: int):
    return db.get(models.Product, product_id)

def create_product(db: Session, data: schemas.ProductCreate):
    obj = models.Product(**data.model_dump())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj

def update_product(db: Session, product_id: int, data: schemas.ProductUpdate):
    obj = db.get(models.Product, product_id)
    if not obj:
        return None
    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(obj, k, v)
    db.commit()
    db.refresh(obj)
    return obj

def delete_product(db: Session, product_id: int):
    obj = db.get(models.Product, product_id)
    if not obj:
        return False
    db.delete(obj)
    db.commit()
    return True

def list_orders(db: Session):
    stmt = select(models.Order).order_by(models.Order.created_at.desc())
    return db.scalars(stmt).all()

def get_order(db: Session, order_id: int):
    return db.get(models.Order, order_id)

def create_order(db: Session, data: schemas.OrderCreate):
    obj = models.Order(**data.model_dump(), status="new")
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj

def update_order(db: Session, order_id: int, data: schemas.OrderUpdate):
    obj = db.get(models.Order, order_id)
    if not obj:
      return None
    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(obj, k, v)
    db.commit()
    db.refresh(obj)
    return obj

def delete_order(db: Session, order_id: int):
    obj = db.get(models.Order, order_id)
    if not obj:
        return False
    db.delete(obj)
    db.commit()
    return True

def list_reviews(db: Session, approved_only: bool = False):
    stmt = select(models.Review).order_by(models.Review.created_at.desc())
    if approved_only:
        stmt = stmt.where(models.Review.approved == True)  # noqa
    return db.scalars(stmt).all()

def create_review(db: Session, data: schemas.ReviewCreate):
    obj = models.Review(**data.model_dump())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj

def update_review(db: Session, review_id: int, data: schemas.ReviewUpdate):
    obj = db.get(models.Review, review_id)
    if not obj:
        return None
    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(obj, k, v)
    db.commit()
    db.refresh(obj)
    return obj

def delete_review(db: Session, review_id: int):
    obj = db.get(models.Review, review_id)
    if not obj:
        return False
    db.delete(obj)
    db.commit()
    return True

def list_gallery(db: Session):
    stmt = select(models.GalleryItem).order_by(models.GalleryItem.sort_order.asc(), models.GalleryItem.created_at.desc())
    return db.scalars(stmt).all()

def create_gallery(db: Session, data: schemas.GalleryCreate):
    obj = models.GalleryItem(**data.model_dump())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj

def update_gallery(db: Session, item_id: int, data: schemas.GalleryUpdate):
    obj = db.get(models.GalleryItem, item_id)
    if not obj:
        return None
    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(obj, k, v)
    db.commit()
    db.refresh(obj)
    return obj

def delete_gallery(db: Session, item_id: int):
    obj = db.get(models.GalleryItem, item_id)
    if not obj:
        return False
    db.delete(obj)
    db.commit()
    return True

def list_contacts(db: Session):
    stmt = select(models.ContactMessage).order_by(models.ContactMessage.created_at.desc())
    return db.scalars(stmt).all()

def create_contact(db: Session, data: schemas.ContactCreate):
    obj = models.ContactMessage(**data.model_dump())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj

def delete_contact(db: Session, contact_id: int):
    obj = db.get(models.ContactMessage, contact_id)
    if not obj:
        return False
    db.delete(obj)
    db.commit()
    return True