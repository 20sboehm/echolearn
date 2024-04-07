from ninja import Schema
from datetime import datetime
from typing import Optional

"""
Schemas are used to define the structure of the data that your API endpoints can recieve (request) or return (response).
"""

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
    owner_id: int

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

class CreateDeck(Schema):
    folder_id: int
    owner_id: int
    name: str
    description: Optional[str] = None

# -----------------------------------------------
# -------------------- Cards --------------------
# -----------------------------------------------

class GetCard(Schema):
    card_id: int
    deck_id: int
    question: str
    answer: str
    bucket: int
    last_reviewed: datetime
    next_review: datetime
    created_at: datetime
    last_edited: datetime

class CreateCard(Schema):
    deck_id: int
    question: str
    answer: str

class Cards(Schema):
    card_id: int
    question: str
    answer: str
    bucket: int
    next_review: datetime

class ReviewCards(Schema):
    deck_id: int
    cards: list[Cards]

# -----------------------------------------------
# ------------------ Sidebar --------------------
# -----------------------------------------------

class DeckInfo(Schema):
    deck_id: int
    name: str

class FolderInfo(Schema):
    folder_id: int
    name: str
    decks: list[DeckInfo]

class GetSidebar(Schema):
    Folders: list[FolderInfo]