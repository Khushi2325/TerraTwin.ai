from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.carbon_engine import CarbonEngine
from services.twin_engine import TwinEngine
from routes.users import MOCK_USERS_DB
from datetime import datetime

router = APIRouter(prefix="/logs", tags=["Logs"])

class LogIn(BaseModel):
    user_id: str
    transport: str
    distance_km: float
    diet: str
    meals: int
    ac_hours: float

@router.post("/submit")
def submit_daily_log(log: LogIn):
    if log.user_id not in MOCK_USERS_DB:
        raise HTTPException(status_code=404, detail="User not found")
        
    user_data = MOCK_USERS_DB[log.user_id]
    
    # Calculate emissions
    # Assuming 0.5 kwh per ac_hour
    kwh = log.ac_hours * 0.5
    daily_total = CarbonEngine.calculate_daily_total(
        log.transport, log.distance_km, log.diet, log.meals, kwh
    )
    
    baseline = 10.0
    delta_pct = ((daily_total - baseline) / baseline) * 100
    
    # Update Twin State
    new_twin_state = TwinEngine.calculate_new_state(user_data.get("twin", TwinEngine.initialize_twin()), delta_pct)
    user_data["twin"] = new_twin_state
    
    # Update XP
    xp_gained = 50 if delta_pct < 0 else 10
    user_data["xp"] = user_data.get("xp", 0) + xp_gained
    
    # Save log
    log_entry = {
        "transport": log.transport, "diet": log.diet,
        "ac_hours": log.ac_hours, "total_kg": daily_total,
        "delta_pct": round(delta_pct, 1),
        "date": datetime.now().isoformat()
    }
    user_data.setdefault("logs", []).append(log_entry)
    
    return {
        "message": "Great choice! Terra is growing." if delta_pct < 0 else "Terra noticed — let's do better tomorrow.",
        "total_kg": daily_total,
        "delta_pct": round(delta_pct, 1),
        "twin": new_twin_state,
        "xp_gained": xp_gained
    }
