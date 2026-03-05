from app.schemas.artist_schema import ArtistCreate, ArtistResponse, ArtistUpdate
from app.models.album import Album
from app.models.artist import Artist
from app.models.artist_album import ArtistAlbum
from fastapi import APIRouter, Depends, HTTPException
import uuid
from sqlalchemy.orm import Session
from app.database import get_db
from sqlalchemy import select, delete, update, func
from typing import List
import random

artist_router = APIRouter(prefix="/artists", tags=["artists"])


# функция для разбивания строки на триаграмы
def trigrams(s: str):
    s = s.lower()
    return {s[i : i + 3] for i in range(len(s) - 2)}


# получить количество артистов
@artist_router.get("/get/count", response_model=int)
def get_artists_count(db: Session = Depends(get_db)):
    result = db.execute(select(func.count()).select_from(Artist)).scalar()
    return result


# получить артиста по id
@artist_router.get("/get/id/{artist_id}", response_model=ArtistResponse)
def get_artist_by_id(artist_id: str, db: Session = Depends(get_db)):
    try:
        stmt = select(Artist).where(Artist.id == artist_id)
        artist = db.execute(stmt).scalars().first()
        if not artist:
            raise HTTPException(status_code=404, detail="Artist not found")
        return artist
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# получить артиста по поиску
@artist_router.get("/get/{info}", response_model=List[ArtistResponse])
def get_artist_by_search(
    info: str, db: Session = Depends(get_db)
) -> List[ArtistResponse]:
    query = info.lower().strip()

    stmt = select(Artist)
    artists = db.execute(stmt).scalars().all()

    scored_artists = []

    if len(query) < 3:
        for artist in artists:
            if query in artist.nickname.lower():
                scored_artists.append((1, artist))
    else:
        query_trigrams = trigrams(query)
        for artist in artists:
            nickname_trigrams = trigrams(artist.nickname)
            score = len(query_trigrams & nickname_trigrams)
            if score > 0:
                scored_artists.append((score, artist))

    scored_artists.sort(key=lambda x: x[0], reverse=True)

    return [ArtistResponse.model_validate(artist) for _, artist in scored_artists[:10]]


# получить всех артистов
@artist_router.get("/get", response_model=List[ArtistResponse])
def get_all_artists(db: Session = Depends(get_db)):
    stmt = select(Artist).order_by(func.lower(Artist.nickname))
    artists = db.execute(stmt).scalars().all()
    return artists


# создать артиста
@artist_router.post("/create")
def create_artist(new_artist: ArtistCreate, db: Session = Depends(get_db)):
    try:
        artist = Artist(
            id=str(uuid.uuid4()),
            name=new_artist.name,
            nickname=new_artist.nickname,
            image_url=new_artist.image_url,
            birthday=new_artist.birthday,
        )
        db.add(artist)
        db.commit()
        return {"success": True}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))


# удалить артиста
@artist_router.delete("/delete/{artist_id}")
def delete_artist(artist_id: str, db: Session = Depends(get_db)):
    try:
        albums = (
            db.execute(
                select(Album)
                .join(ArtistAlbum, Album.id == ArtistAlbum.album_id)
                .where(ArtistAlbum.artist_id == artist_id)
            )
            .scalars()
            .all()
        )

        for album in albums:
            artists_count = db.execute(
                select(func.count())
                .select_from(ArtistAlbum)
                .where(ArtistAlbum.album_id == album.id)
            ).scalar()

            if artists_count == 1:
                db.execute(delete(Album).where(Album.id == album.id))
            else:
                db.execute(
                    delete(ArtistAlbum).where(
                        ArtistAlbum.album_id == album.id,
                        ArtistAlbum.artist_id == artist_id,
                    )
                )

        db.execute(delete(Artist).where(Artist.id == artist_id))
        db.commit()
        return {"success": True}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))


# удалить всех артистов
@artist_router.delete("/delete")
def delete_all_artists(db: Session = Depends(get_db)):
    try:
        stmt = delete(Artist)
        db.execute(stmt)
        db.commit()
        return {"success": True}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))


# обновить артиста
@artist_router.put("/update/{artist_id}")
def update_artist(
    artist_id: str, update_artist: ArtistUpdate, db: Session = Depends(get_db)
):
    try:
        stmt = (
            update(Artist)
            .where(Artist.id == artist_id)
            .values(**update_artist.model_dump(exclude_unset=True))
        )
        db.execute(stmt)
        db.commit()
        return {"success": True}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))


# получить случайных артистов(4), нужно для страницы home
@artist_router.get("/random", response_model=List[ArtistResponse])
def get_random_artists(db: Session = Depends(get_db)):
    try:
        all_artists = db.execute(select(Artist)).scalars().all()
        if not all_artists:
            return []
        k = min(4, len(all_artists))
        random_artists = random.sample(all_artists, k=k)
        return random_artists
    except Exception as e:
        raise HTTPException(status_code=505, detail=str(e))


# получить артистов пагинацией
@artist_router.get("/artists-pagination", response_model=List[ArtistResponse])
def get_artists_pagination(
    skip: int = 0, limit: int = 8, db: Session = Depends(get_db)
):
    try:
        stmt = (
            select(Artist)
            .order_by(func.lower(Artist.nickname))
            .offset(skip)
            .limit(limit)
        )
        artists = db.execute(stmt).scalars().all()
        return artists
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# получить артистов пагинацией после поиска(не используется)
# @artist_router.get("/artists-pagination/{search}", response_model=List[ArtistResponse])
# def get_artists_pagination_by_search(
#     search: str, skip: int = 0, limit: int = 8, db: Session = Depends(get_db)
# ):
#     query = search.lower().strip()

#     stmt = select(Artist)
#     artists = db.execute(stmt).scalars().all()

#     scored_artists = []

#     if len(query) < 3:
#         for artist in artists:
#             if query in artist.nickname.lower():
#                 scored_artists.append((1, artist))
#     else:
#         query_trigrams = trigrams(query)
#         for artist in artists:
#             nickname_trigrams = trigrams(artist.nickname)
#             score = len(query_trigrams & nickname_trigrams)
#             if score > 0:
#                 scored_artists.append((score, artist))

#     scored_artists.sort(key=lambda x: x[0], reverse=True)

#     paginated = scored_artists[skip : skip + limit]

#     return [ArtistResponse.model_validate(artist) for _, artist in paginated]
