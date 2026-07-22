"""
NeuroTraceX — Email Notification Service

Sends automated Session 2 reminder emails 48 hours after Session 1 completion
using the Resend Email API.
"""

import logging
from typing import Dict, Any
import anyio
import resend

from app.config import get_settings

logger = logging.getLogger("neurotracex.email")
settings = get_settings()


def _send_email_sync(to_email: str, subject: str, html_content: str) -> Dict[str, Any]:
    """Synchronous call to Resend API."""
    resend.api_key = settings.resend_api_key
    
    # Send email
    params = {
        "from": settings.resend_from_email,
        "to": [to_email],
        "subject": subject,
        "html": html_content,
    }
    
    response = resend.Emails.send(params)
    return response


async def send_session2_reminder(
    to_email: str,
    first_name: str,
    session_id_str: str,
    app_base_url: str = "http://localhost:3000",
) -> bool:
    """
    Sends the 48-hour Session 2 reminder email.
    Runs the synchronous Resend SDK call in a separate thread.
    
    Args:
        to_email: Target participant email.
        first_name: Participant's first name for greeting.
        session_id_str: Participant's unique anonymous session identifier.
        app_base_url: Base URL of the React frontend.
        
    Returns:
        Boolean indicating if the email was successfully accepted by Resend.
    """
    if not settings.resend_api_key:
        logger.warning("Resend API key is not configured. Email reminder simulated.")
        logger.info(f"[SIMULATED EMAIL] To: {to_email}, Name: {first_name}, Link: {app_base_url}/session2/{session_id_str}")
        return True

    # Construct unique returning link
    session2_link = f"{app_base_url}/session2/{session_id_str}"
    
    subject = "NeuroTraceX Memory Study — Session 2 Follow-up"
    
    html_content = f"""
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
        <h2 style="color: #4f46e5;">Hello {first_name},</h2>
        <p>Thank you for completing the first session of the <strong>NeuroTraceX</strong> cognitive psychology study.</p>
        <p>As scheduled, it has been 48 hours, and it is now time to complete the second and final session of the study.</p>
        <div style="margin: 30px 0; text-align: center;">
            <a href="{session2_link}" style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                Start Session 2 Recall
            </a>
        </div>
        <p style="font-size: 14px; color: #666;">
            This session is entirely from memory and will take approximately 10 minutes. 
            Once completed, you will immediately see your personalized memory divergence and cognitive style results.
        </p>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;" />
        <p style="font-size: 12px; color: #999; text-align: center;">
            NeuroTraceX Research Study — Cognitive Psychology Division
        </p>
    </div>
    """

    try:
        # Run sync email function in a background worker thread
        await anyio.to_thread.run_sync(
            _send_email_sync, to_email, subject, html_content
        )
        logger.info(f"Session 2 reminder email successfully sent to {to_email}")
        return True
    except Exception as e:
        logger.error(f"Failed to send Session 2 reminder email to {to_email}: {str(e)}")
        return False
