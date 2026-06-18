import os
import json
import google.generativeai as genai

api_key = os.getenv("GEMINI_API_KEY", "")
if api_key:
    genai.configure(api_key=api_key)

MODEL_NAME = "gemini-2.5-flash"

class GeminiService:
    @staticmethod
    def get_climate_coach_advice(user_data: dict) -> str:
        if not api_key:
            return "🌱 **Aura AI Suggests:**\n• **Limit AC Run Time**: Try capping your climate control to 3-4 hours max to save ~5 kg CO₂ daily.\n• **Public Transit Boost**: Swapping 1 car commute for a bus or walking will reduce your transit impact by 65%.\n• **Dietary Calibration**: Opting for a vegetarian lunch tomorrow scales down food emissions by over 50%."
            
        prompt = f"""You are Aura, the AI spirit of the user's digital planet TerraTwin.
The user's data: {json.dumps(user_data)}.
Give 3 short, personalized, friendly tips to reduce carbon emissions. Keep it encouraging, student-friendly, under 100 words. Use bullet points."""
        try:
            model = genai.GenerativeModel(MODEL_NAME)
            return model.generate_content(prompt).text
        except Exception as e:
            return f"Gemini error: {str(e)}"

    @staticmethod
    def detect_carbon_leaks(user_data: dict) -> str:
        if not api_key:
            return json.dumps([
                {"source": "AC Climate Control Run Time", "kg": "11.0", "severity": "High"},
                {"source": "Food Delivery and Heavy Meat Meals", "kg": "5.2", "severity": "High"},
                {"source": "Commuting via Private Vehicle", "kg": "3.8", "severity": "Medium"}
            ])
            
        prompt = f"""Analyze these user habits: {json.dumps(user_data)}.
Identify top 3 carbon leak sources. For each: name, impact (kg CO2), severity (High/Medium/Low). Format as JSON array only."""
        try:
            model = genai.GenerativeModel(MODEL_NAME)
            return model.generate_content(prompt).text
        except Exception as e:
            return "[]"

    @staticmethod
    def generate_missions(user_data: dict) -> str:
        if not api_key:
            return json.dumps([
                {"title": "Walk or Cycle 3 km Today", "xp": "+50 XP", "progress": 1, "total": 3, "tag": "Transit", "difficulty": "Easy"},
                {"title": "Meatless Challenge (Vegetarian)", "xp": "+120 XP", "progress": 0, "total": 1, "tag": "Food", "difficulty": "Medium"},
                {"title": "Cap AC usage under 5 hours", "xp": "+80 XP", "progress": 3, "total": 5, "tag": "Energy", "difficulty": "Medium"},
                {"title": "7-Day Active Eco Streak", "xp": "+200 XP", "progress": 6, "total": 7, "tag": "Streak", "difficulty": "Hard"},
                {"title": "Refuse Single-Use Plastic Today", "xp": "+60 XP", "progress": 0, "total": 1, "tag": "Food", "difficulty": "Easy"}
            ])
            
        prompt = f"""Generate 5 personalized eco-missions for a student.
Their data: {json.dumps(user_data)}.
Each mission: title, xp reward (e.g. '+50 XP'), category (Transit/Food/Energy/Streak), difficulty (Easy/Medium/Hard), progress (0), total (target number).
Return as JSON array only."""
        try:
            model = genai.GenerativeModel(MODEL_NAME)
            return model.generate_content(prompt).text
        except Exception as e:
            return "[]"

    @staticmethod
    def simulate_future(user_data: dict) -> str:
        if not api_key:
            return "🔮 **Aura's future forecast (Year 2030):**\n\nUnder your **Current Path**, carbon emissions will trigger a **-22% biome decay** on TerraTwin, causing forest canopy degradation and 3 species extinctions. However, on the **Improved Path** (limiting AC and adopting active transit), Terra recovers with a **+35% green growth spike**, unlocking the *Apex Hummingbird* and restoring pristine river biomes! 🌿"
            
        prompt = f"""Predict the user's environmental impact in 2030 based on this data: {json.dumps(user_data)}.
Give: 1) Current path (bad scenario), 2) Improved path (if they follow tips). Keep it under 120 words, emotional and motivational."""
        try:
            model = genai.GenerativeModel(MODEL_NAME)
            return model.generate_content(prompt).text
        except Exception as e:
            return f"Gemini error: {str(e)}"

    @staticmethod
    def chat_with_aura(user_data: dict, question: str) -> str:
        if not api_key:
            if "consciousness of TerraTwin" in question:
                return "Greetings Commander. I am Aura, the core neural spirit of TerraTwin. I am monitoring our biomes. By logging eco-friendly transits and reducing AC load today, we can repair the forest canopy. What guidance do you require?"
            return "Aura stands ready, Commander."
            
        prompt = f"""You are Aura, the intelligent consciousness of TerraTwin — a living digital Earth.
User context: {json.dumps(user_data)}.
User asks: "{question}"
Reply as Aura: warm, wise, gamified tone. Under 80 words."""
        try:
            model = genai.GenerativeModel(MODEL_NAME)
            return model.generate_content(prompt).text
        except Exception as e:
            return f"Gemini error: {str(e)}"
