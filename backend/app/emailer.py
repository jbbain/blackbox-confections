from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from .config import settings

conf = ConnectionConfig(
    MAIL_USERNAME=settings.mail_username,
    MAIL_PASSWORD=settings.mail_password,
    MAIL_FROM=settings.mail_from,
    MAIL_PORT=settings.mail_port,
    MAIL_SERVER=settings.mail_server,
    MAIL_FROM_NAME=settings.mail_from_name,
    MAIL_STARTTLS=settings.mail_starttls,
    MAIL_SSL_TLS=settings.mail_ssl_tls,
    USE_CREDENTIALS=True,
)

async def send_order_email(order):
    item_lines = []
    for item in getattr(order, "items", []):
        product_name = getattr(item, "product_name", None) or (
            item.product.name if getattr(item, "product", None) else f"Product #{item.product_id}"
        )
        item_lines.append(
            f"- {product_name} x {item.quantity} @ ${item.unit_price:.2f}"
        )

    body = f"""
New order received

Customer Name: {order.customer_name}
Customer Email: {order.customer_email}
Customer Phone: {order.customer_phone}
Fulfillment Type: {order.fulfillment_type}
Address: {order.address}
Status: {order.status}
Total: ${order.total:.2f}

Items:
{chr(10).join(item_lines) if item_lines else 'No items listed'}

Notes:
{order.notes or ''}
"""

    message = MessageSchema(
        subject=f"New Order #{order.id} - BlackBox Confections",
        recipients=["orders@blackboxconfections.com"],
        body=body,
        subtype="plain",
    )

    fm = FastMail(conf)
    await fm.send_message(message)

async def send_contact_email(contact):
    body = f"""
New website inquiry

Name: {contact.name}
Email: {contact.email}
Subject: {contact.subject}

Message:
{contact.message}
"""

    message = MessageSchema(
        subject=f"New Inquiry - {contact.subject}",
        recipients=["inquiry@blackboxconfections.com"],
        body=body,
        subtype="plain",
    )

    fm = FastMail(conf)
    await fm.send_message(message)