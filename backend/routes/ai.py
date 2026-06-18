from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from services.gemini_service import GeminiService
from routes.users import MOCK_USERS_DB

router = APIRouter(prefix="/ai", tags=["AI"])

class AIRequest(BaseModel):
    user_id: str
    question: Optional[str] = None

@router.get("/coach/{user_id}")
def get_climate_coach(user_id: str):
    if user_id not in MOCK_USERS_DB:
        raise HTTPException(status_code=404, detail="User not found")
    
    user_data = MOCK_USERS_DB[user_id]
    advice = GeminiService.get_climate_coach_advice(user_data)
    return {"advice": advice}

@router.get("/leaks/{user_id}")
def detect_carbon_leaks(user_id: str):
    if user_id not in MOCK_USERS_DB:
        raise HTTPException(status_code=404, detail="User not found")
    
    user_data = MOCK_USERS_DB[user_id]
    leaks = GeminiService.detect_carbon_leaks(user_data)
    return {"leaks": leaks}

@router.get("/missions/{user_id}")
def generate_missions(user_id: str):
    if user_id not in MOCK_USERS_DB:
        raise HTTPException(status_code=404, detail="User not found")
    
    user_data = MOCK_USERS_DB[user_id]
    missions = GeminiService.generate_missions(user_data)
    return {"missions": missions}

@router.get("/future/{user_id}")
def simulate_future(user_id: str):
    if user_id not in MOCK_USERS_DB:
        raise HTTPException(status_code=404, detail="User not found")
    
    user_data = MOCK_USERS_DB[user_id]
    future = GeminiService.simulate_future(user_data)
    return {"future": future}

@router.post("/chat")
def chat_with_aura(req: AIRequest):
    if req.user_id not in MOCK_USERS_DB:
        user_data = {}
    else:
        user_data = MOCK_USERS_DB[req.user_id]
        
    question = req.question or "How can I reduce my carbon footprint today?"
    reply = GeminiService.chat_with_aura(user_data, question)
    return {"reply": reply}
