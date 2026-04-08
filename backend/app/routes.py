from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from .db import get_db
from . import crud, schemas
from .emailer import send_order_email, send_order_confirmation_email, send_contact_email, send_inquiry_confirmation_email

router = APIRouter()

@router.get("/health")
def health():
    return {"ok": True}

# -------- Products --------
@router.get("/products", response_model=list[schemas.ProductOut])
def list_products(active_only: bool = Query(False), db: Session = Depends(get_db)):
    return crud.list_products(db, active_only=active_only)

@router.get("/products/{product_id}", response_model=schemas.ProductOut)
def get_product(product_id: int, db: Session = Depends(get_db)):
    obj = crud.get_product(db, product_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Product not found")
    return obj

@router.post("/products", response_model=schemas.ProductOut)
def create_product(data: schemas.ProductCreate, db: Session = Depends(get_db)):
    return crud.create_product(db, data)

@router.put("/products/{product_id}", response_model=schemas.ProductOut)
def update_product(product_id: int, data: schemas.ProductUpdate, db: Session = Depends(get_db)):
    obj = crud.update_product(db, product_id, data)
    if not obj:
        raise HTTPException(status_code=404, detail="Product not found")
    return obj

@router.delete("/products/{product_id}")
def delete_product(product_id: int, db: Session = Depends(get_db)):
    ok = crud.delete_product(db, product_id)
    if not ok:
        raise HTTPException(status_code=404, detail="Product not found")
    return {"deleted": True}

# -------- Orders --------
@router.get("/orders", response_model=list[schemas.OrderOut])
def list_orders(db: Session = Depends(get_db)):
    return crud.list_orders(db)

@router.get("/orders/{order_id}", response_model=schemas.OrderOut)
def get_order(order_id: int, db: Session = Depends(get_db)):
    obj = crud.get_order(db, order_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Order not found")
    return obj

@router.post("/orders", response_model=schemas.OrderOut)
async def create_order(data: schemas.OrderCreate, db: Session = Depends(get_db)):
    obj = crud.create_order(db, data)
    try:
        await send_order_email(obj)
    except Exception as e:
        print(f"Failed to send order email: {e}")
    try:
        await send_order_confirmation_email(obj)
    except Exception as e:
        print(f"Failed to send order confirmation email: {e}")
    return obj

@router.put("/orders/{order_id}", response_model=schemas.OrderOut)
def update_order(order_id: int, data: schemas.OrderUpdate, db: Session = Depends(get_db)):
    obj = crud.update_order(db, order_id, data)
    if not obj:
        raise HTTPException(status_code=404, detail="Order not found")
    return obj

@router.delete("/orders/{order_id}")
def delete_order(order_id: int, db: Session = Depends(get_db)):
    ok = crud.delete_order(db, order_id)
    if not ok:
        raise HTTPException(status_code=404, detail="Order not found")
    return {"deleted": True}

# -------- Reviews --------
@router.get("/reviews", response_model=list[schemas.ReviewOut])
def list_reviews(approved_only: bool = Query(False), db: Session = Depends(get_db)):
    return crud.list_reviews(db, approved_only=approved_only)

@router.post("/reviews", response_model=schemas.ReviewOut)
def create_review(data: schemas.ReviewCreate, db: Session = Depends(get_db)):
    return crud.create_review(db, data)

@router.put("/reviews/{review_id}", response_model=schemas.ReviewOut)
def update_review(review_id: int, data: schemas.ReviewUpdate, db: Session = Depends(get_db)):
    obj = crud.update_review(db, review_id, data)
    if not obj:
        raise HTTPException(status_code=404, detail="Review not found")
    return obj

@router.delete("/reviews/{review_id}")
def delete_review(review_id: int, db: Session = Depends(get_db)):
    ok = crud.delete_review(db, review_id)
    if not ok:
        raise HTTPException(status_code=404, detail="Review not found")
    return {"deleted": True}

# -------- Gallery --------
@router.get("/gallery", response_model=list[schemas.GalleryOut])
def list_gallery(db: Session = Depends(get_db)):
    return crud.list_gallery(db)

@router.post("/gallery", response_model=schemas.GalleryOut)
def create_gallery(data: schemas.GalleryCreate, db: Session = Depends(get_db)):
    return crud.create_gallery(db, data)

@router.put("/gallery/{item_id}", response_model=schemas.GalleryOut)
def update_gallery(item_id: int, data: schemas.GalleryUpdate, db: Session = Depends(get_db)):
    obj = crud.update_gallery(db, item_id, data)
    if not obj:
        raise HTTPException(status_code=404, detail="Gallery item not found")
    return obj

@router.delete("/gallery/{item_id}")
def delete_gallery(item_id: int, db: Session = Depends(get_db)):
    ok = crud.delete_gallery(db, item_id)
    if not ok:
        raise HTTPException(status_code=404, detail="Gallery item not found")
    return {"deleted": True}

# -------- Contact --------
@router.get("/contacts", response_model=list[schemas.ContactOut])
def list_contacts(db: Session = Depends(get_db)):
    return crud.list_contacts(db)

@router.post("/contact", response_model=schemas.ContactOut)
async def create_contact(data: schemas.ContactCreate, db: Session = Depends(get_db)):
    obj = crud.create_contact(db, data)
    try:
        await send_contact_email(obj)
    except Exception as e:
        print(f"Failed to send contact email: {e}")
    try:
        await send_inquiry_confirmation_email(obj)
    except Exception as e:
        print(f"Failed to send inquiry confirmation email: {e}")
    return obj

@router.delete("/contacts/{contact_id}")
def delete_contact(contact_id: int, db: Session = Depends(get_db)):
    ok = crud.delete_contact(db, contact_id)
    if not ok:
        raise HTTPException(status_code=404, detail="Contact message not found")
    return {"deleted": True}