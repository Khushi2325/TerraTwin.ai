from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.twin_engine import TwinEngine

router = APIRouter(prefix="/users", tags=["Users"])

# In-memory mock DB for MVP
MOCK_USERS_DB = {}

class UserCreate(BaseModel):
    user_id: str
    name: str
    email: str

@router.post("/create")
def create_user(user: UserCreate):
    if user.user_id in MOCK_USERS_DB:
        return MOCK_USERS_DB[user.user_id]
    
    twin_state = TwinEngine.initialize_twin()
    MOCK_USERS_DB[user.user_id] = {
        "profile": user.model_dump() if hasattr(user, 'model_dump') else user.dict(),
        "twin": twin_state,
        "logs": [],
        "xp": 0,
        "streak": 0
    }
    return MOCK_USERS_DB[user.user_id]

@router.get("/{user_id}")
def get_user(user_id: str):
    if user_id not in MOCK_USERS_DB:
        return {"error": "User not found"}
    return MOCK_USERS_DB[user_id]
