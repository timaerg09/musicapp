from pydantic import BaseModel, ConfigDict
from typing import Optional
import datetime
from uuid import UUID

class BaseSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)

class AlbumCreate(BaseSchema):
    title: str
    year: int   
    cover_url: str
    
class AlbumUpdate(BaseSchema):
    title: Optional[str]
    year: Optional[int]   
    cover_url: Optional[str]
    
class AlbumResponse(BaseSchema):
    id: str
    title: str
    year: int  
    cover_url: str
    
    
    
    