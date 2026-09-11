"""
NeuroTraceX — User Schemas

Pydantic v2 models for user auth validation and serialization.
"""

import uuid
from datetime import datetime

import re
from pydantic import BaseModel, EmailStr, Field, field_validator


class UserRegister(BaseModel):
    """Request body for new user registration."""
    name: str = Field(..., min_length=1, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=6)

    @field_validator('password')
    @classmethod
    def validate_password(cls, v: str) -> str:
        if not re.search(r'[A-Z]', v):
            raise ValueError('Password must contain at least 1 uppercase letter')
        if not re.search(r'[^a-zA-Z0-9]', v):
            raise ValueError('Password must contain at least 1 special character')
        return v


class UserLogin(BaseModel):
    """Request body for user login."""
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    """User data returned to the frontend (no password)."""
    id: uuid.UUID
    name: str
    email: str
    created_at: datetime

    model_config = {"from_attributes": True}


class TokenResponse(BaseModel):
    """JWT token returned on successful auth."""
    access_token: str
    token_type: str = "bearer"
    user: UserResponse
