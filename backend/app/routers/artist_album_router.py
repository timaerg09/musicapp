from app.schemas.artist_schema import ArtistCreate, ArtistResponse, ArtistUpdate
from app.schemas.album_schema import AlbumCreate, AlbumResponse, AlbumUpdate
from app.schemas.artist_album_schema import (
    Artist_AlbumCreate,
    Artist_AlbumResponse,
    Artist_AlbumUpdate,
    AlbumArtistsResponse
)
from app.models.album import Album
from app.models.artist import Artist
from app.models.artist_album import ArtistAlbum
from fastapi import APIRouter, Depends, HTTPException, Query
import datetime
import uuid
from sqlalchemy.orm import Session
from app.database import get_db
from sqlalchemy import select, delete, update, func
from typing import List

artist_album_router = APIRouter(prefix="/artist-album", tags=["artist_album"])


@artist_album_router.post("/create")
def create_artist_album_connection(
    artist_ids: List[str]=Query(...), album_ids: List[str]=Query(...), db: Session = Depends(get_db)
):
    try:
        for artist_id in artist_ids:
            for album_id in album_ids:
                db.add(ArtistAlbum(artist_id=artist_id, album_id=album_id))

        db.commit()
        return {"Success": True}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))


@artist_album_router.get("/get/artists/by-albums", response_model=List[AlbumArtistsResponse])
def get_artists_by_albums(album_ids: List[str] = Query(...), db: Session = Depends(get_db)):
    try:
        artists_result = []
        for album_id in album_ids:
            artists = (
                db.execute(
                    select(Artist)
                    .join(ArtistAlbum, Artist.id == ArtistAlbum.artist_id)
                    .where(ArtistAlbum.album_id == album_id)
                )
                .scalars()
                .all()
            )
            artists_result.append({
                "album_id": album_id,
                "artists": artists
            })
        
        return artists_result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@artist_album_router.get("/get/albums/by-artist", response_model=List[AlbumResponse])
def get_albums_by_artist(artist_id: str, db: Session = Depends(get_db)):
    try:
        albums = (
            db.execute(
                select(Album)
                .join(ArtistAlbum, Album.id == ArtistAlbum.album_id)
                .where(ArtistAlbum.artist_id == artist_id)
                .order_by(Album.year.desc())
            )
            .scalars()
            .all()
        )
        return albums
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@artist_album_router.delete("/delete/connection")
def delete_connection(artist_id: str=Query(...), album_id: str=Query(...), db: Session = Depends(get_db)):
    try:
        stmt = delete(ArtistAlbum).where(
            ArtistAlbum.artist_id == artist_id, ArtistAlbum.album_id == album_id
        )
        db.execute(stmt)
        db.commit()
        return {"Success": True}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@artist_album_router.delete("/delete")
def delete_all_connections(db: Session = Depends(get_db)):
    try:
        db.execute(delete(ArtistAlbum))
        db.commit()
        return {"Success": True}
    except Exception as e:
        raise HTTPException(status_code=505, detail=str(e))
