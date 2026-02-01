from app.database import init_db
from app.models.artist import Artist
from app.models.album import Album
from app.models.artist_album import ArtistAlbum 

if __name__ == "__main__":
    init_db()
    print("Таблицы созданы")