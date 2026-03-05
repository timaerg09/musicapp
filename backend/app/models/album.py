from sqlalchemy import Column, String, Integer
import uuid
from app.database import Base


class Album(Base):
    __tablename__ = "Album"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    title = Column(String, nullable=False)
    year = Column(Integer)
    cover_url = Column(String)

    @property
    def year_only(self):
        return self.year.year if self.year else None
