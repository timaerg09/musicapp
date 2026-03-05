from sqlalchemy import Column, String, Date
import uuid
from app.database import Base


class Artist(Base):
    __tablename__ = "Artist"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, nullable=False)
    nickname = Column(String, nullable=False)
    image_url = Column(String)
    birthday = Column(Date)
