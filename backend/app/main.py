from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.endpoints import router as api_router
from app.services.data_loader import DataLoader

@asynccontextmanager
async def lifespan(app: FastAPI):
    DataLoader.load_all()
    print("[Diksha Backend] Data loaded successfully.")
    yield

app = FastAPI(
    title="Indian Official Statistical System - Skill Intelligence API",
    description="Backend API for skill competency assessment, roadmap generation, iGOT course mapping, and quiz generation.",
    version="1.0.0",
    lifespan=lifespan
)

# Configure CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows frontend on localhost:3000 and local dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "Diksha Skill Intelligence Backend",
        "port": settings.PORT,
        "environment": settings.ENVIRONMENT
    }

# Include API router with /api prefix
app.include_router(api_router, prefix="/api")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=settings.PORT, reload=True)
