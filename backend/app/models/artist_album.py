from sqlalchemy import Column, ForeignKey, String
import uuid
from app.database import Base
from sqlalchemy.dialects.postgresql import UUID

class ArtistAlbum(Base):
    __tablename__ = "ArtistAlbum"

    # id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.UUID)

    artist_id = Column(String, ForeignKey("Artist.id"), primary_key=True)
    album_id = Column(String, ForeignKey("Album.id"), primary_key=True)
