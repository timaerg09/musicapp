from sqlalchemy import Column, String, Date
import uuid
from app.database import Base
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship


class Artist(Base):
    __tablename__ = "Artist"

    id = Column(String, primary_key=True, default=str(uuid.uuid4))
    name = Column(String, nullable=False)
    nickname = Column(String, nullable=False)
    image_url = Column(String)
    country = Column(String)
    birthday = Column(Date)

    # albums = relationship("Album", secondary="ArtistAlbum", back_populates="artists")
