from sqlalchemy import Column, ForeignKey, String
from app.database import Base

# модель АртистАльбом для установления связи артиста с альбомом
class ArtistAlbum(Base):
    __tablename__ = "ArtistAlbum"

    artist_id = Column(String, ForeignKey("Artist.id"), primary_key=True)
    album_id = Column(String, ForeignKey("Album.id"), primary_key=True)
