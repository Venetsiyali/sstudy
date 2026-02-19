from pydantic import BaseModel, EmailStr
from app.models.user import UserRole

class UserBase(BaseModel):
    email: EmailStr
    is_active: bool = True
    full_name: str | None = None
    role: UserRole = UserRole.STUDENT

class UserCreate(UserBase):
    password: str

class UserUpdate(UserBase):
    password: str | None = None

class UserInDBBase(UserBase):
    id: int
    
    class Config:
        from_attributes = True

class User(UserInDBBase):
    pass
