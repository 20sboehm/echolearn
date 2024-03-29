from ninja import Schema
from typing import Optional
from datetime import date, datetime

# class UserSchema(Schema):
#     user_id: int
#     name: str
#     email: str 

class FolderSchema(Schema):
    folder_id: int

class DeckSchema(Schema):
    deck_id: int
    name: str

class CardSchema(Schema):
    question: str
    answer: str

class ShareDeck(Schema):
    deck_id: int
    user_id: int

# class UserSchema(Schema):
#     user_id: int
#     name: str
#     email: str 

# class FolderSchema(Schema):
#     folder_id: int  
#     last_edited: datetime  
#     created_at: datetime  
#     name: str  
#     user_id: int 

# class DeckSchema(Schema):
#     deck_id: int
#     name: str
#     folder_id: int
#     last_edited: datetime
#     created_at: datetime
#     statistics: str
#     description: Optional[str]
#     owned_by: int
#     shared_with: Optional[int]

# class CardSchema(Schema):
#     card_id: int
#     deck_id: int 
#     question: str
#     answer: str
#     last_edited: date
#     created_at: date
#     last_reviewed: Optional[datetime] 
#     next_review: Optional[datetime] 
#     bucket: str

# class ShareDeck(Schema):
#     deck_id: int
#     user_id: int