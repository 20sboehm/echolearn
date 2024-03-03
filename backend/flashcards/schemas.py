from ninja import Schema

class DeckSchema(Schema):
    deck_id: int
    title: str

class CardSchema(Schema):
    card_id: int
    deck: int
    question: str
    answer: str
