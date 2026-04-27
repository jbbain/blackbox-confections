from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, cast, Date
from datetime import datetime, timedelta
import httpx
from .db import get_db
from . import crud, schemas, models
from .config import settings
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
# NOTE: Orders are now submitted directly to Google Sheets via frontend
# These endpoints are kept for admin dashboard analytics only

@router.get("/orders", response_model=list[schemas.OrderOut])
def list_orders(db: Session = Depends(get_db)):
    """Get historical orders from database (read-only for dashboard)."""
    return crud.list_orders(db)

@router.get("/orders/{order_id}", response_model=schemas.OrderOut)
def get_order(order_id: int, db: Session = Depends(get_db)):
    """Get a specific historical order (read-only for dashboard)."""
    obj = crud.get_order(db, order_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Order not found")
    return obj

@router.post("/orders", response_model=schemas.OrderOut)
async def create_order(data: schemas.OrderCreate, db: Session = Depends(get_db)):
    """DEPRECATED: Orders are now submitted to Google Sheets directly from frontend.
    This endpoint is maintained for backward compatibility only."""
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
    """Update a historical order record."""
    obj = crud.update_order(db, order_id, data)
    if not obj:
        raise HTTPException(status_code=404, detail="Order not found")
    return obj

@router.delete("/orders/{order_id}")
def delete_order(order_id: int, db: Session = Depends(get_db)):
    """Delete a historical order record."""
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

# -------- Page Visit Tracking --------
@router.post("/track")
def track_page_visit(body: dict, db: Session = Depends(get_db)):
    page = body.get("page", "/")
    visit = models.PageVisit(page=page)
    db.add(visit)
    db.commit()
    return {"ok": True}

# -------- Analytics / Dashboard --------
@router.get("/analytics/summary")
def analytics_summary(days: int = Query(30, ge=1, le=365), db: Session = Depends(get_db)):
    """Return aggregate counts and time-series data for the admin dashboard."""
    now = datetime.utcnow()
    cutoff = now - timedelta(days=days)

    # Counts
    total_orders = db.query(func.count(models.Order.id)).scalar() or 0
    total_inquiries = db.query(func.count(models.ContactMessage.id)).scalar() or 0
    total_reviews = db.query(func.count(models.Review.id)).scalar() or 0
    total_gallery = db.query(func.count(models.GalleryItem.id)).scalar() or 0
    total_visits = db.query(func.count(models.PageVisit.id)).scalar() or 0

    # Orders by status
    order_statuses = (
        db.query(models.Order.status, func.count(models.Order.id))
        .group_by(models.Order.status)
        .all()
    )
    status_map = {s: c for s, c in order_statuses}

    # Orders per day (last 30 days)
    orders_by_day = (
        db.query(
            func.date(models.Order.created_at).label("day"),
            func.count(models.Order.id)
        )
        .filter(models.Order.created_at >= cutoff)
        .group_by("day")
        .order_by("day")
        .all()
    )

    # Inquiries per day
    inquiries_by_day = (
        db.query(
            func.date(models.ContactMessage.created_at).label("day"),
            func.count(models.ContactMessage.id)
        )
        .filter(models.ContactMessage.created_at >= cutoff)
        .group_by("day")
        .order_by("day")
        .all()
    )

    # Page visits per day
    visits_by_day = (
        db.query(
            func.date(models.PageVisit.visited_at).label("day"),
            func.count(models.PageVisit.id)
        )
        .filter(models.PageVisit.visited_at >= cutoff)
        .group_by("day")
        .order_by("day")
        .all()
    )

    # Page visits by page (filtered by date range)
    visits_by_page = (
        db.query(
            models.PageVisit.page,
            func.count(models.PageVisit.id),
            func.min(models.PageVisit.visited_at),
            func.max(models.PageVisit.visited_at),
        )
        .filter(models.PageVisit.visited_at >= cutoff)
        .group_by(models.PageVisit.page)
        .order_by(func.count(models.PageVisit.id).desc())
        .all()
    )

    # Dessert type breakdown
    dessert_types = (
        db.query(models.Order.dessert_type, func.count(models.Order.id))
        .filter(models.Order.dessert_type != "")
        .group_by(models.Order.dessert_type)
        .order_by(func.count(models.Order.id).desc())
        .all()
    )

    # Event type breakdown
    event_types = (
        db.query(models.Order.event_type, func.count(models.Order.id))
        .filter(models.Order.event_type != "")
        .group_by(models.Order.event_type)
        .order_by(func.count(models.Order.id).desc())
        .all()
    )

    # Inquiry subject breakdown
    inquiry_subjects = (
        db.query(models.ContactMessage.subject, func.count(models.ContactMessage.id))
        .group_by(models.ContactMessage.subject)
        .order_by(func.count(models.ContactMessage.id).desc())
        .all()
    )

    # Recent activity feed (last 10 orders + inquiries, merged by time)
    recent_orders = (
        db.query(models.Order)
        .order_by(models.Order.created_at.desc())
        .limit(5)
        .all()
    )
    recent_contacts = (
        db.query(models.ContactMessage)
        .order_by(models.ContactMessage.created_at.desc())
        .limit(5)
        .all()
    )

    activity = []
    for o in recent_orders:
        activity.append({
            "type": "order",
            "text": f"{o.customer_name} submitted an order ({o.dessert_type or 'custom'})",
            "time": o.created_at.isoformat() if o.created_at else ""
        })
    for c in recent_contacts:
        activity.append({
            "type": "inquiry",
            "text": f"{c.name} sent an inquiry ({c.subject})",
            "time": c.created_at.isoformat() if c.created_at else ""
        })
    activity.sort(key=lambda x: x["time"], reverse=True)

    return {
        "totals": {
            "orders": total_orders,
            "inquiries": total_inquiries,
            "reviews": total_reviews,
            "gallery": total_gallery,
            "visits": total_visits
        },
        "order_statuses": status_map,
        "orders_by_day": [{"day": str(d), "count": c} for d, c in orders_by_day],
        "inquiries_by_day": [{"day": str(d), "count": c} for d, c in inquiries_by_day],
        "visits_by_day": [{"day": str(d), "count": c} for d, c in visits_by_day],
        "visits_by_page": [
            {
                "page": p,
                "count": c,
                "first_visit": fv.isoformat() if fv else "",
                "last_visit": lv.isoformat() if lv else "",
            }
            for p, c, fv, lv in visits_by_page
        ],
        "dessert_types": [{"type": t, "count": c} for t, c in dessert_types],
        "event_types": [{"type": t, "count": c} for t, c in event_types],
        "inquiry_subjects": [{"subject": s, "count": c} for s, c in inquiry_subjects],
        "activity": activity[:10]
    }

# -------- Vercel Web Analytics Proxy --------
VERCEL_API = "https://vercel.com/api/web/insights/stats"

@router.get("/analytics/vercel")
async def vercel_analytics():
    """Proxy Vercel Web Analytics data for browsers, countries, devices, OS, referrers."""
    token = settings.vercel_api_token
    project_id = settings.vercel_project_id

    if not token or not project_id:
        raise HTTPException(status_code=501, detail="Vercel analytics not configured")

    headers = {"Authorization": f"Bearer {token}"}

    now = datetime.utcnow()
    from_str = (now - timedelta(days=30)).strftime("%Y-%m-%dT%H:%M:%SZ")
    to_str = now.strftime("%Y-%m-%dT%H:%M:%SZ")

    # Vercel dimension types → friendly keys
    dimension_map = {
        "client_name": "browser",
        "country": "country",
        "device_type": "device",
        "os_name": "os",
        "referrer_hostname": "referrer",
    }

    result = {}
    async with httpx.AsyncClient(timeout=15) as client:
        for vercel_type, key in dimension_map.items():
            url = f"{VERCEL_API}/{vercel_type}"
            params = {
                "projectId": project_id,
                "from": from_str,
                "to": to_str,
                "limit": "10",
            }
            try:
                resp = await client.get(url, headers=headers, params=params)
                if resp.status_code == 200:
                    result[key] = resp.json().get("data", [])
                else:
                    result[key] = []
            except Exception:
                result[key] = []

    return result