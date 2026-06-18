from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import users, logs, ai
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="TerraTwin AI Core API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(users.router)
app.include_router(logs.router)
app.include_router(ai.router)

@app.get("/")
def root():
    return {"message": "TerraTwin AI API is running 🌍", "version": "1.0.0"}
