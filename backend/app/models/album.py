from sqlalchemy import Column, String, DateTime, ForeignKey
import uuid
from app.database import Base
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship


class Album(Base):
    __tablename__ = "Album"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String, nullable=False)
    year = Column(DateTime)
    cover_url = Column(String)

    # artists = relationship("Artist", secondary="ArtistAlbum", back_populates="albums")


    @property
    def year_only(self):
        return self.year.year if self.year else None
