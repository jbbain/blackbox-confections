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
            image_url="/static/gallery/aka-cake.webp",
            caption="Custom AKA celebration cake with signature pink and green detailing, crest artwork, pearls, and luxury fondant accents.",
            sort_order=1,
        ),
        models.GalleryItem(
            image_url="/static/gallery/law-order-cake.webp",
            caption="Bold Law & Order themed two-tier custom cake with dramatic fondant crime-scene tape styling and statement birthday details.",
            sort_order=2,
        ),
        models.GalleryItem(
            image_url="/static/gallery/mickey-cake.webp",
            caption="Whimsical Mickey-inspired birthday cake with playful fondant architecture, bright color blocking, and custom name toppers.",
            sort_order=3,
        ),
        models.GalleryItem(
            image_url="/static/gallery/IMG_0635.webp",
            caption="ACT XXXV celebration cake with rich color blocking, metallic detailing, and custom Roman numeral topper.",
            sort_order=4,
        ),
        models.GalleryItem(
            image_url="/static/gallery/IMG_1012.webp",
            caption="Luxury letter cake finished with strawberries, Ferrero Rocher, raspberries, and elegant piped buttercream.",
            sort_order=5,
        ),
        models.GalleryItem(
            image_url="/static/gallery/IMG_1102.webp",
            caption="Custom JKS themed two-tier cake with bold graphic styling and fondant portrait details.",
            sort_order=6,
        ),
        models.GalleryItem(
            image_url="/static/gallery/IMG_2665.webp",
            caption="Regal black and gold cake with crown topper, honeycomb accents, and luxury painted textures.",
            sort_order=7,
        ),
        models.GalleryItem(
            image_url="/static/gallery/IMG_2955.webp",
            caption="Metro bus themed custom cake with handcrafted fondant vehicle detailing and bold lettering.",
            sort_order=8,
        ),
        models.GalleryItem(
            image_url="/static/gallery/IMG_2995.webp",
            caption="Warm autumn-inspired cake with vibrant orange and yellow buttercream florals and a soft seasonal finish.",
            sort_order=9,
        ),
        models.GalleryItem(
            image_url="/static/gallery/IMG_4638.webp",
            caption="Pink beauty-themed cake with gold scissors, florals, and elegant salon-inspired details.",
            sort_order=10,
        ),
        models.GalleryItem(
            image_url="/static/gallery/IMG_5283.webp",
            caption="Gaming-inspired two-tier birthday cake featuring custom console and video game artwork.",
            sort_order=11,
        ),
        models.GalleryItem(
            image_url="/static/gallery/IMG_5671.webp",
            caption="Music-inspired custom photo cake with bold black buttercream piping and artist collage panels.",
            sort_order=12,
        ),
        models.GalleryItem(
            image_url="/static/gallery/IMG_5880.webp",
            caption="Fortnite themed pull-apart cupcake cake with handcrafted edible game elements and playful terrain styling.",
            sort_order=13,
        ),
        models.GalleryItem(
            image_url="/static/gallery/IMG_6798.webp",
            caption="Elegant floral wedding cake set with cascading pink blossoms and a timeless romantic finish.",
            sort_order=14,
        ),
        models.GalleryItem(
            image_url="/static/gallery/IMG_7453.webp",
            caption="Minimal lavender birthday cake with soft textures and sleek modern presentation.",
            sort_order=15,
        ),
        models.GalleryItem(
            image_url="/static/gallery/IMG_7622.webp",
            caption="Luxury teal and gold tiered cake with orchid florals, metallic drip, and elevated event styling.",
            sort_order=16,
        ),
        models.GalleryItem(
            image_url="/static/gallery/IMG_8038.webp",
            caption="Royal blue princess-themed cake with gold castle silhouette and elegant storybook-inspired details.",
            sort_order=17,
        ),
        models.GalleryItem(
            image_url="/static/gallery/IMG_9054.webp",
            caption="Rosette birthday cake in romantic pink tones with soft floral piping and a classic celebration finish.",
            sort_order=18,
        ),
        models.GalleryItem(
            image_url="/static/gallery/IMG_9110.webp",
            caption="Vibrant tropical birthday cake with palm leaves, flamingo accents, and bold sunset-inspired color.",
            sort_order=19,
        ),
    ]
    db.add_all(gallery)

    reviews = [
        models.Review(
            name="Alicia",
            rating=5,
            message="The Black Velvet slice is unreal. Rich, not too sweet.",
            approved=True
        ),
        models.Review(
            name="Marcus",
            rating=5,
            message="Macarons were delicate and perfectly balanced. Premium experience.",
            approved=True
        ),
        models.Review(
            name="Sasha",
            rating=4,
            message="Brownies were fudgy with that perfect crackle. Will order again.",
            approved=True
        ),
    ]
    db.add_all(reviews)
    db.commit()