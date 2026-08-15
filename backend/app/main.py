from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import auth, predict, url, image, history, evidence, pdf
from app.database.database import engine
from app.models import user
from app.database.history_db import engine as history_engine, HistoryBase
from app.database import history_models
from app.services.predictor import predictor
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create database tables
user.Base.metadata.create_all(bind=engine)
HistoryBase.metadata.create_all(bind=history_engine)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Load ML Models
    logger.info("Starting up FakeCheckPro ML API...")
    predictor.load_artifacts()
    yield
    # Shutdown
    logger.info("Shutting down FakeCheckPro API...")

app = FastAPI(
    title="FakeCheckPro API",
    description="Authentication and ML Inference API for Fake News Detection",
    lifespan=lifespan
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
app.include_router(predict.router)
app.include_router(url.router)
app.include_router(image.router)
app.include_router(history.router)
app.include_router(evidence.router)
app.include_router(pdf.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to FakeCheckPro API"}
