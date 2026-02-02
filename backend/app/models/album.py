from sqlalchemy import Column, String, DateTime, ForeignKey, Date, Integer
import uuid
from app.database import Base
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship


class Album(Base):
    __tablename__ = "Album"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    title = Column(String, nullable=False)
    year = Column(Integer)
    cover_url = Column(String)

    # artists = relationship("Artist", secondary="ArtistAlbum", back_populates="albums")


    @property
    def year_only(self):
        return self.year.year if self.year else None
