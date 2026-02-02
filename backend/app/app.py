from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers.artist_router import artist_router
from app.routers.album__router import album_router
from app.routers.artist_album_router import artist_album_router
from app.config import settings

app = FastAPI(title="Music app", version="0.1.0", docs_url="/docs", redoc_url="/redoc")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# @app.get("/")
# def root():
#     return {"ok": True}

app.include_router(artist_router)
app.include_router(album_router)
app.include_router(artist_album_router)
