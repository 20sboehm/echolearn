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
    parent_id: Optional[int]

class CreateFolder(Schema):
    name: str
    owner_id: int
    parent_id: Optional[int] = None

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
