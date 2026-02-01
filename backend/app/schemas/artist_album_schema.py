from pydantic import BaseModel, ConfigDict
from typing import Optional
import datetime
from uuid import UUID

class BaseSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
class Artist_AlbumCreate(BaseSchema):
    artist_id : UUID
    album_id : UUID
    
    
class Artist_AlbumUpdate(BaseSchema):
    artist_id : Optional[UUID]
    album_id : Optional[UUID]
    
    
class Artist_AlbumResponse(BaseSchema):
    artist_id : UUID
    album_id : UUID