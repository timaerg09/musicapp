from sqlalchemy import Column, ForeignKey
import uuid
from app.database import Base
from sqlalchemy.dialects.postgresql import UUID

class ArtistAlbum(Base):
    __tablename__ = "Artist-Album"

    # id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.UUID)

    artist_id = Column(UUID(as_uuid=True), ForeignKey("Artist.id"), primary_key=True)
    album_id = Column(UUID(as_uuid=True), ForeignKey("Album.id"), primary_key=True)
