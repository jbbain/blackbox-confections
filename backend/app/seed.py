from sqlalchemy.orm import Session
from . import models

def seed(db: Session):
    # Only seed if no products exist
    if db.query(models.Product).count() > 0:
        return

    products = [
        models.Product(
            name="Black Velvet Cake Slice",
            description="Ultra-moist cocoa sponge with silky dark chocolate ganache.",
            price=8.50,
            image_url="https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?auto=format&fit=crop&w=1200&q=80",
            category="Cakes",
            is_active=True,
        ),
        models.Product(
            name="Cherry Noir Macarons (6)",
            description="Almond shells with cherry-red buttercream and a whisper of vanilla.",
            price=16.00,
            image_url="https://images.unsplash.com/photo-1612197528075-8b0d24dd47ce?auto=format&fit=crop&w=1200&q=80",
            category="Macarons",
            is_active=True,
        ),
        models.Product(
            name="Midnight Brownies (4)",
            description="Fudgy, crackled top, finished with sea salt.",
            price=14.00,
            image_url="https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=1200&q=80",
            category="Brownies",
            is_active=True,
        ),
    ]
    db.add_all(products)

    gallery = [
        models.GalleryItem(
            image_url="https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=1200&q=80",
            caption="Signature ganache pour.",
            sort_order=1,
        ),
        models.GalleryItem(
            image_url="https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=1200&q=80",
            caption="Cherry accents. Pure luxury.",
            sort_order=2,
        ),
        models.GalleryItem(
            image_url="https://images.unsplash.com/photo-1551106652-a5bcf4b29ab6?auto=format&fit=crop&w=1200&q=80",
            caption="Minimalist plating, maximum flavor.",
            sort_order=3,
        ),
    ]
    db.add_all(gallery)

    reviews = [
        models.Review(name="Alicia", rating=5, message="The Black Velvet slice is unreal. Rich, not too sweet.", approved=True),
        models.Review(name="Marcus", rating=5, message="Macarons were delicate and perfectly balanced. Premium experience.", approved=True),
        models.Review(name="Sasha", rating=4, message="Brownies were fudgy with that perfect crackle. Will order again.", approved=True),
    ]
    db.add_all(reviews)
    db.commit()
