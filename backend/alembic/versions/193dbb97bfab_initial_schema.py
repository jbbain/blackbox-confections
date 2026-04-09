"""initial_schema

Revision ID: 193dbb97bfab
Revises: 
Create Date: 2026-04-08 03:50:54.111043

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '193dbb97bfab'
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Create all tables from scratch (safe for fresh deploys)."""
    conn = op.get_bind()
    inspector = sa.inspect(conn)
    existing = inspector.get_table_names()

    if 'products' not in existing:
        op.create_table(
            'products',
            sa.Column('id', sa.Integer(), primary_key=True, autoincrement=True),
            sa.Column('name', sa.String(200), nullable=False),
            sa.Column('description', sa.Text(), server_default=''),
            sa.Column('price', sa.Float(), nullable=False, server_default='0.0'),
            sa.Column('image_url', sa.String(5000), server_default=''),
            sa.Column('category', sa.String(120), server_default='Baked Goods'),
            sa.Column('is_active', sa.Boolean(), server_default='1'),
            sa.Column('image_scale', sa.Float(), server_default='1.0'),
            sa.Column('image_x', sa.Float(), server_default='0.0'),
            sa.Column('image_y', sa.Float(), server_default='0.0'),
            sa.Column('created_at', sa.DateTime()),
        )

    if 'orders' not in existing:
        op.create_table(
            'orders',
            sa.Column('id', sa.Integer(), primary_key=True, autoincrement=True),
            sa.Column('customer_name', sa.String(200), nullable=False),
            sa.Column('customer_email', sa.String(200), nullable=False),
            sa.Column('customer_phone', sa.String(80), server_default=''),
            sa.Column('event_type', sa.String(120), server_default=''),
            sa.Column('dessert_type', sa.String(120), server_default=''),
            sa.Column('servings', sa.String(80), server_default=''),
            sa.Column('event_date', sa.String(80), server_default=''),
            sa.Column('pickup_or_delivery', sa.String(30), server_default='pickup'),
            sa.Column('color_theme', sa.String(255), server_default=''),
            sa.Column('flavor_preferences', sa.String(255), server_default=''),
            sa.Column('inspiration_notes', sa.Text(), server_default=''),
            sa.Column('status', sa.String(30), server_default='new'),
            sa.Column('created_at', sa.DateTime()),
        )

    if 'reviews' not in existing:
        op.create_table(
            'reviews',
            sa.Column('id', sa.Integer(), primary_key=True, autoincrement=True),
            sa.Column('name', sa.String(200), nullable=False),
            sa.Column('rating', sa.Integer(), server_default='5'),
            sa.Column('message', sa.Text(), nullable=False),
            sa.Column('approved', sa.Boolean(), server_default='1'),
            sa.Column('created_at', sa.DateTime()),
        )

    if 'gallery' not in existing:
        op.create_table(
            'gallery',
            sa.Column('id', sa.Integer(), primary_key=True, autoincrement=True),
            sa.Column('image_url', sa.String(500), nullable=False),
            sa.Column('caption', sa.String(240), server_default=''),
            sa.Column('sort_order', sa.Integer(), server_default='0'),
            sa.Column('created_at', sa.DateTime()),
        )

    if 'contact_messages' not in existing:
        op.create_table(
            'contact_messages',
            sa.Column('id', sa.Integer(), primary_key=True, autoincrement=True),
            sa.Column('name', sa.String(200), nullable=False),
            sa.Column('email', sa.String(200), nullable=False),
            sa.Column('phone', sa.String(80), server_default=''),
            sa.Column('subject', sa.String(200), server_default='General Inquiry'),
            sa.Column('message', sa.Text(), nullable=False),
            sa.Column('created_at', sa.DateTime()),
        )
    else:
        # Existing DB: ensure phone column is present
        cols = [c['name'] for c in inspector.get_columns('contact_messages')]
        if 'phone' not in cols:
            with op.batch_alter_table('contact_messages') as batch_op:
                batch_op.add_column(sa.Column('phone', sa.String(80), server_default=''))

    if 'page_visits' not in existing:
        op.create_table(
            'page_visits',
            sa.Column('id', sa.Integer(), primary_key=True, autoincrement=True),
            sa.Column('page', sa.String(200), nullable=False),
            sa.Column('visited_at', sa.DateTime()),
        )


def downgrade() -> None:
    """Drop all tables."""
    op.drop_table('page_visits')
    op.drop_table('contact_messages')
    op.drop_table('gallery')
    op.drop_table('reviews')
    op.drop_table('orders')
    op.drop_table('products')
