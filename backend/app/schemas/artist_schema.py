from pydantic import BaseModel, ConfigDict
from typing import Optional
import datetime
from uuid import UUID

class BaseSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)

class ArtistCreate(BaseSchema):
    name : str
    nickname : str
    image_url: str
    country: str
    birthday: datetime.date    
    
class ArtistUpdate(BaseSchema):
    name : Optional[str]
    nickname : Optional[str]
    image_url: Optional[str]
    country: Optional[str]
    birthday: Optional[datetime.date]
    
class ArtistResponse(BaseSchema):
    id: str
    name : str
    nickname : str
    image_url: str
    country: str
    birthday: datetime.date   
    
    