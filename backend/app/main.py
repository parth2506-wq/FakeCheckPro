from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import auth
from app.database.database import engine
from app.models import user

# Create database tables
user.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="FakeCheckPro Authentication API",
    description="Authentication API for Fake News Detection & Verification Platform"
)

# CORS configuration
origins = [
    "http://localhost:5173", # Vite default
    "http://127.0.0.1:5173",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to FakeCheckPro API"}
