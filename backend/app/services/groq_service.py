import os
import json
import logging
from typing import Optional, Dict, Any, List
from app.core.config import settings

logger = logging.getLogger(__name__)

def get_groq_client(api_key: Optional[str] = None):
    key = api_key or settings.GROQ_API_KEY
    if not key:
        return None
    try:
        from groq import Groq
        return Groq(api_key=key)
    except Exception as e:
        logger.error(f"Failed to initialize Groq client: {e}")
        return None

def call_groq_chat(
    system_prompt: str,
    user_prompt: str,
    api_key: Optional[str] = None,
    json_mode: bool = False,
    temperature: float = 0.3,
    max_tokens: int = 1500
) -> Optional[str]:
    client = get_groq_client(api_key)
    if not client:
        return None

    try:
        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ]
        
        kwargs = {
            "messages": messages,
            "model": settings.GROQ_MODEL,
            "temperature": temperature,
            "max_tokens": max_tokens
        }
        if json_mode:
            kwargs["response_format"] = {"type": "json_object"}

        response = client.chat.completions.create(**kwargs)
        return response.choices[0].message.content
    except Exception as e:
        logger.warning(f"Groq API call failed: {e}")
        return None
