import os
from pathlib import Path
import certifi
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig, MessageType
from .config import settings

BASE_DIR = Path(__file__).resolve().parent.parent
LOGO_PATH = BASE_DIR / "static" / "logo.png"

# Fix macOS Python SSL: CERTIFICATE_VERIFY_FAILED
os.environ["SSL_CERT_FILE"] = certifi.where()

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
    # Format event_date from "2026-04-07" to "Apr 7, 2026"
    from datetime import datetime
    event_date_display = order.event_date or "Not specified"
    if order.event_date:
        try:
            dt = datetime.strptime(order.event_date, "%Y-%m-%d")
            event_date_display = dt.strftime("%b %-d, %Y")
        except ValueError:
            pass

    created_display = order.created_at.strftime("%b %-d, %Y at %-I:%M %p") if order.created_at else "—"

    html = f"""
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>New Order #{order.id}</title>
</head>
<body style="margin:0; padding:0; background-color:#F2F2F2; font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#F2F2F2; padding:40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px; width:100%;">

          <!-- Header -->
          <tr>
            <td style="background-color:#050505; padding:32px 40px; text-align:center;">
              <img src="cid:logo"
                   alt="BlackBox Confections"
                   width="100"
                   style="display:block; margin:0 auto; width:100px; height:auto;" />
            </td>
          </tr>

          <!-- Alert banner -->
          <tr>
            <td style="background-color:#D2042D; padding:14px 40px; text-align:center;">
              <h1 style="margin:0; font-family:Georgia, 'Times New Roman', serif; font-size:18px; font-weight:700; color:#FFFFFF; letter-spacing:1.5px; text-transform:uppercase;">
                New Order Request &mdash; #{order.id}
              </h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background-color:#FFFFFF; padding:32px 40px 16px;">
              <p style="margin:0 0 4px; font-size:12px; text-transform:uppercase; letter-spacing:1px; color:#999999;">
                Submitted
              </p>
              <p style="margin:0 0 24px; font-size:15px; color:#333333; font-weight:600;">
                {created_display}
              </p>
            </td>
          </tr>

          <!-- Customer info -->
          <tr>
            <td style="background-color:#FFFFFF; padding:0 40px 24px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
                     style="background-color:#FAFAFA; border-left:3px solid #D2042D;">
                <tr>
                  <td style="padding:20px 24px 8px;">
                    <h3 style="margin:0 0 12px; font-family:Georgia, 'Times New Roman', serif; font-size:13px; text-transform:uppercase; letter-spacing:1.5px; color:#D2042D;">
                      Customer Details
                    </h3>
                  </td>
                </tr>
                <tr>
                  <td style="padding:0 24px 20px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:14px; color:#333333;">
                      <tr>
                        <td style="padding:5px 0; color:#888888; width:110px; vertical-align:top;">Name</td>
                        <td style="padding:5px 0; font-weight:600;">{order.customer_name}</td>
                      </tr>
                      <tr>
                        <td style="padding:5px 0; color:#888888; vertical-align:top;">Email</td>
                        <td style="padding:5px 0;">
                          <a href="mailto:{order.customer_email}" style="color:#D2042D; text-decoration:none;">{order.customer_email}</a>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:5px 0; color:#888888; vertical-align:top;">Phone</td>
                        <td style="padding:5px 0;">{order.customer_phone or '—'}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Order details -->
          <tr>
            <td style="background-color:#FFFFFF; padding:0 40px 24px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
                     style="background-color:#FAFAFA; border-left:3px solid #050505;">
                <tr>
                  <td style="padding:20px 24px 8px;">
                    <h3 style="margin:0 0 12px; font-family:Georgia, 'Times New Roman', serif; font-size:13px; text-transform:uppercase; letter-spacing:1.5px; color:#050505;">
                      Order Details
                    </h3>
                  </td>
                </tr>
                <tr>
                  <td style="padding:0 24px 20px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:14px; color:#333333;">
                      <tr>
                        <td style="padding:5px 0; color:#888888; width:140px; vertical-align:top;">Event Type</td>
                        <td style="padding:5px 0;">{order.event_type or '—'}</td>
                      </tr>
                      <tr>
                        <td style="padding:5px 0; color:#888888; vertical-align:top;">Dessert Type</td>
                        <td style="padding:5px 0;">{order.dessert_type or '—'}</td>
                      </tr>
                      <tr>
                        <td style="padding:5px 0; color:#888888; vertical-align:top;">Servings</td>
                        <td style="padding:5px 0;">{order.servings or '—'}</td>
                      </tr>
                      <tr>
                        <td style="padding:5px 0; color:#888888; vertical-align:top;">Event Date</td>
                        <td style="padding:5px 0; font-weight:600;">{event_date_display}</td>
                      </tr>
                      <tr>
                        <td style="padding:5px 0; color:#888888; vertical-align:top;">Fulfillment</td>
                        <td style="padding:5px 0;">{(order.pickup_or_delivery or 'pickup').capitalize()}</td>
                      </tr>
                      <tr>
                        <td style="padding:5px 0; color:#888888; vertical-align:top;">Color Theme</td>
                        <td style="padding:5px 0;">{order.color_theme or '—'}</td>
                      </tr>
                      <tr>
                        <td style="padding:5px 0; color:#888888; vertical-align:top;">Flavor Prefs</td>
                        <td style="padding:5px 0;">{order.flavor_preferences or '—'}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Inspiration notes -->
          <tr>
            <td style="background-color:#FFFFFF; padding:0 40px 32px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
                     style="background-color:#FAFAFA; border-left:3px solid #888888;">
                <tr>
                  <td style="padding:20px 24px 8px;">
                    <h3 style="margin:0 0 12px; font-family:Georgia, 'Times New Roman', serif; font-size:13px; text-transform:uppercase; letter-spacing:1.5px; color:#888888;">
                      Inspiration Notes
                    </h3>
                  </td>
                </tr>
                <tr>
                  <td style="padding:0 24px 20px;">
                    <p style="margin:0; font-size:14px; line-height:1.6; color:#333333; white-space:pre-wrap;">{order.inspiration_notes or 'None provided'}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#050505; padding:20px 40px; text-align:center;">
              <p style="margin:0; font-size:11px; color:#666666;">
                This is an internal order notification from blackboxconfections.com
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
"""

    message = MessageSchema(
        subject=f"🎂 New Order #{order.id} — {order.customer_name} | {order.event_type or 'Custom'} | {event_date_display}",
        recipients=["orders@blackboxconfections.com"],
        body=html,
        subtype=MessageType.html,
        attachments=[{
            "file": str(LOGO_PATH),
            "headers": {
                "Content-ID": "<logo>",
                "Content-Disposition": "inline; filename=\"logo.png\"",
            },
            "mime_type": "image",
            "mime_subtype": "png",
        }],
    )

    fm = FastMail(conf)
    await fm.send_message(message)


async def send_order_confirmation_email(order):
    """Auto-response to the customer after they submit an order request."""
    from datetime import datetime

    # Format event_date nicely
    event_date_display = order.event_date or "TBD"
    if order.event_date:
        try:
            dt = datetime.strptime(order.event_date, "%Y-%m-%d")
            event_date_display = dt.strftime("%b %-d, %Y")
        except ValueError:
            pass

    first_name = order.customer_name.split()[0] if order.customer_name else "there"

    html = f"""
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Order Confirmation</title>
</head>
<body style="margin:0; padding:0; background-color:#FAFAFA; font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#FAFAFA; padding:40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px; width:100%;">

          <!-- Header -->
          <tr>
            <td style="background-color:#050505; padding:40px 40px 30px; text-align:center;">
              <img src="cid:logo"
                   alt="BlackBox Confections"
                   width="120"
                   style="display:block; margin:0 auto; width:120px; height:auto;" />
              <div style="width:40px; height:2px; background-color:#D2042D; margin:16px auto 0;"></div>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background-color:#FFFFFF; padding:40px;">
              <h2 style="margin:0 0 8px; font-family:Georgia, 'Times New Roman', serif; font-size:22px; color:#050505;">
                Thank you, {first_name}.
              </h2>
              <p style="margin:0 0 24px; font-size:15px; line-height:1.7; color:#444444;">
                We've received your custom order request and are excited to start bringing your vision to life.
                A member of our team will review the details and reach out to you shortly to discuss next steps,
                pricing, and any finishing touches.
              </p>

              <!-- Order summary card -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
                     style="background-color:#FAFAFA; border:1px solid #E8E8E8; margin-bottom:24px;">
                <tr>
                  <td style="padding:20px 24px 8px;">
                    <h3 style="margin:0 0 12px; font-family:Georgia, 'Times New Roman', serif; font-size:14px; text-transform:uppercase; letter-spacing:1.5px; color:#D2042D;">
                      Order Summary
                    </h3>
                  </td>
                </tr>
                <tr>
                  <td style="padding:0 24px 20px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:14px; color:#333333;">
                      <tr>
                        <td style="padding:6px 0; color:#888888; width:140px; vertical-align:top;">Order #</td>
                        <td style="padding:6px 0; font-weight:600;">{order.id}</td>
                      </tr>
                      <tr>
                        <td style="padding:6px 0; color:#888888; vertical-align:top;">Event Type</td>
                        <td style="padding:6px 0;">{order.event_type or '—'}</td>
                      </tr>
                      <tr>
                        <td style="padding:6px 0; color:#888888; vertical-align:top;">Dessert Type</td>
                        <td style="padding:6px 0;">{order.dessert_type or '—'}</td>
                      </tr>
                      <tr>
                        <td style="padding:6px 0; color:#888888; vertical-align:top;">Servings</td>
                        <td style="padding:6px 0;">{order.servings or '—'}</td>
                      </tr>
                      <tr>
                        <td style="padding:6px 0; color:#888888; vertical-align:top;">Event Date</td>
                        <td style="padding:6px 0;">{event_date_display}</td>
                      </tr>
                      <tr>
                        <td style="padding:6px 0; color:#888888; vertical-align:top;">Fulfillment</td>
                        <td style="padding:6px 0;">{(order.pickup_or_delivery or 'pickup').capitalize()}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 6px; font-size:15px; line-height:1.7; color:#444444;">
                If you have any questions in the meantime, feel free to reply to this email or
                reach us at <a href="mailto:orders@blackboxconfections.com" style="color:#D2042D; text-decoration:none; font-weight:600;">orders@blackboxconfections.com</a>.
              </p>
              <p style="margin:24px 0 0; font-size:15px; line-height:1.7; color:#444444;">
                We can't wait to create something beautiful for you.
              </p>
              <p style="margin:16px 0 0; font-size:15px; color:#050505; font-weight:600;">
                — The BlackBox Confections Team
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#050505; padding:24px 40px; text-align:center;">
              <p style="margin:0 0 4px; font-size:12px; color:#888888;">
                &copy; 2020 BlackBox Confections. All rights reserved.
              </p>
              <p style="margin:0; font-size:12px; color:#666666;">
                <a href="https://www.blackboxconfections.com" style="color:#D2042D; text-decoration:none;">blackboxconfections.com</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
"""

    message = MessageSchema(
        subject="We've Received Your Order Request — BlackBox Confections",
        recipients=[order.customer_email],
        body=html,
        subtype=MessageType.html,
        attachments=[{
            "file": str(LOGO_PATH),
            "headers": {
                "Content-ID": "<logo>",
                "Content-Disposition": "inline; filename=\"logo.png\"",
            },
            "mime_type": "image",
            "mime_subtype": "png",
        }],
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