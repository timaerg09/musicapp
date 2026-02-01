from pydantic import BaseModel, ConfigDict
from typing import Optional
import datetime
from uuid import UUID

class BaseSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)

class AlbumCreate(BaseSchema):
    title: str
    year: datetime.date   
    cover_url: str
    
class AlbumUpdate(BaseSchema):
    title: Optional[str]
    year: Optional[datetime.date]   
    cover_url: Optional[str]
    
class AlbumResponse(BaseSchema):
    id: UUID
    title: str
    year: datetime.date   
    cover_url: str
    
    
    
    