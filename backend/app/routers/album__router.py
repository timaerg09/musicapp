from app.schemas.artist_schema import ArtistCreate, ArtistResponse, ArtistUpdate
from app.schemas.album_schema import AlbumCreate, AlbumResponse, AlbumUpdate
from app.schemas.artist_album_schema import (
    Artist_AlbumCreate,
    Artist_AlbumResponse,
    Artist_AlbumUpdate,
)
from app.models.album import Album
from app.models.artist import Artist
from app.models.artist_album import ArtistAlbum
from fastapi import APIRouter, Depends, HTTPException
import datetime
import uuid
from sqlalchemy.orm import Session
from app.database import get_db
from sqlalchemy import select, delete, update, func
from typing import List
import random


album_router= APIRouter(prefix="/albums", tags=["albums"])


def trigrams(s: str):
    s = s.lower()
    return {s[i:i+3] for i in range(len(s) - 2)}


@album_router.get("/get/{info}", response_model=List[AlbumResponse])
def get_album_by_search(info: str, db: Session = Depends(get_db)) -> List[AlbumResponse]:
    query = info.lower().strip()

    stmt = select(Album)
    albums = db.execute(stmt).scalars().all()

    scored_albums = []

    if len(query) < 3:
        for album in albums:
            if query in album.title.lower():
                scored_albums.append((1, album))
    else:
        query_trigrams = trigrams(query)
        for album in albums:
            title_trigrams = trigrams(album.title)
            score = len(query_trigrams & title_trigrams)
            if score > 0:
                scored_albums.append((score, album))

    scored_albums.sort(key=lambda x: x[0], reverse=True)

    return [AlbumResponse.model_validate(album) for _, album in scored_albums[:10]]
                
    
    


@album_router.get("/get", response_model=List[AlbumResponse])
def get_all_albums(db: Session = Depends(get_db)):
    stmt = select(Album).order_by(func.lower(Album.title))
    albums = db.execute(stmt).scalars().all()
    return albums


@album_router.get("/get/id/{album_id}", response_model=AlbumResponse)
def get_album_by_id(album_id: str, db: Session = Depends(get_db)):
    try:
        stmt = select(Album).where(Album.id == album_id)
        album = db.execute(stmt).scalars().first()
        if not album:
            raise HTTPException(status_code=404, detail="Album not found")
        return album
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@album_router.post("/create")
def create_album(new_album: AlbumCreate, db: Session = Depends(get_db)):
    try:
        album = Album(
            id=str(uuid.uuid4()),
            title=new_album.title,
            year=new_album.year,
            cover_url=new_album.cover_url
        )
        db.add(album)
        db.commit()
        return {"success": True}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))


@album_router.delete("/delete/{album_id}")
def delete_album(album_id: str, db: Session = Depends(get_db)):
    try:
        stmt = delete(Album).where(Album.id == album_id)
        db.execute(stmt)
        db.commit()
        return {"success": True}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))


@album_router.delete("/delete")
def delete_all_albums(db: Session = Depends(get_db)):
    try:
        stmt = delete(Album)
        db.execute(stmt)
        db.commit()
        return {"success": True}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))


@album_router.put("/update/{album_id}")
def update_album(
    album_id: str, update_album: AlbumUpdate, db: Session = Depends(get_db)
):
    try:
        stmt = (
            update(Album)
            .where(Album.id == album_id)
            .values(**update_album.model_dump(exclude_unset=True))
        )
        db.execute(stmt)
        db.commit()
        return {"success": True}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))




@album_router.get("/random", response_model=List[AlbumResponse])
def get_random_albums(db: Session = Depends(get_db)):
    try:
        all_albums = db.execute(select(Album)).scalars().all()
        if not all_albums:
            return []
        random_albums = random.sample(all_albums, k=4)
        return random_albums
    except Exception as e:
        raise HTTPException(status_code=505, detail=str(e))
  




@album_router.get("/albums-pagination", response_model=List[AlbumResponse])
def get_ablums_pagination(
    skip: int = 0, limit: int = 20, db: Session = Depends(get_db)
):
    try:
        stmt = (
            select(Album)
            .order_by(func.lower(Album.title))
            .offset(skip)
            .limit(limit)
        )
        albums = db.execute(stmt).scalars().all()
        return albums
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
