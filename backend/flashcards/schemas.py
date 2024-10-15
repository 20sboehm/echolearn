from ninja import Schema
from datetime import datetime
from typing import Optional
from typing import Union

"""
Schemas are used to define the structure of the data that your API endpoints can recieve (request) or return (response).
"""

# -----------------------------------------------
# ------------------ Users --------------------
# -----------------------------------------------

class GetUser(Schema):
    username: str
    email: Optional[str] = None
    age: Optional[int] = None
    country: Optional[str] = None
    flip_mode: Optional[bool] = None
    sidebar_open: Optional[bool] = None
    light_mode: Optional[bool] = None

class UserLogin(Schema):
    username: str
    userpassword: str

class UpdateUser(Schema):
    username: Optional[str] = None
    email: Optional[str] = None
    age: Optional[int] = None
    country: Optional[str] = None
    flip_mode: Optional[bool] = None
    sidebar_open: Optional[bool] = None
    light_mode: Optional[bool] = None

# class GetUser(Schema):
    


# -------------------------------------------------
# -------------------- Folders --------------------
# -------------------------------------------------

class GetFolder(Schema):
    folder_id: int
    owner_id: int
    name: str
    last_edited: datetime
    created_at: datetime

class CreateFolder(Schema):
    name: str
    folder_id: Optional[int] = None

class UpdateFolder(Schema):
    name: Optional[str] = None

# -----------------------------------------------
# -------------------- Decks --------------------
# -----------------------------------------------

class GetDeck(Schema):
    deck_id: int
    folder_id: int
    owner_id: int
    name: str
    description: str
    statistics: int
    created_at: datetime
    last_edited: datetime
    isPublic:bool

class CreateDeck(Schema):
    folder_id: int
    name: str
    description: Optional[str] = None
    
class UpdateDeck(Schema):
    name: Optional[str] = None
    description: Optional[str] = None
    folder_id: Optional[int] = None




# -----------------------------------------------
# -------------------- Cards --------------------
# -----------------------------------------------

class GetCard(Schema):
    card_id: int
    deck_id: int
    question: str
    answer: str
    # questionvideolink: str
    # answervideolink: str
    # questionimagelink: str
    # answerimagelink: str
    # questionlatex: str
    # answerlatex: str
    bucket: int
    last_reviewed: datetime
    next_review: datetime
    created_at: datetime
    last_edited: datetime
    is_new: bool
    correct_count: int
    incorrect_count: int
    review_history: list[datetime]

class UpdateCard(Schema):
    question: Optional[str] = None
    answer: Optional[str] = None
    bucket: Optional[int] = None
    next_review: Optional[datetime] = None
    last_reviewed: Optional[datetime] = None
    # questionvideolink: Optional[str] = None
    # answervideolink: Optional[str] = None
    # questionimagelink: Optional[str] = None
    # answerimagelink: Optional[str] = None
    # questionlatex: Optional[str] = None
    # answerlatex: Optional[str] = None
    correct_count: Optional[int] = None
    incorrect_count: Optional[int] = None
    review_history: Optional[list[datetime]] = None

class CreateCard(Schema):
    deck_id: int
    question: str
    answer: str

class Cards(Schema):
    card_id: int
    question: str
    answer: str
    bucket: int
    # questionvideolink:str
    # answervideolink:str
    # questionimagelink:str
    # answerimagelink:str
    # questionlatex:str
    # answerlatex:str
    correct_count: int = None
    incorrect_count: int = None
    next_review: datetime

class ReviewCards(Schema):
    deck_id: int
    deck_name: str
    cards: list[Cards]

class DeckCards(Schema):
    deck_id: int
    isPublic:bool
    deck_name: str
    cards: list[GetCard]
    stars:int
    
class EditCards(Schema):
    question: Optional[str] = None
    answer: Optional[str] = None

# -----------------------------------------------
# ------------------ Sidebar --------------------
# -----------------------------------------------

class DeckInfo(Schema):
    deck_id: int
    parent_folder_id: int
    name: str

class FolderInfo(Schema):
    folder_id: int
    name: str
    decks: list[DeckInfo]
    children: Optional[list['FolderInfo']] = []

class GetSidebar(Schema):
    folders: list[FolderInfo]
