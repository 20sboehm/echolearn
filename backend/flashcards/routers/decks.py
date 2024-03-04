from ninja import Router
from flashcards.models import Deck
from flashcards import schemas
from typing import List

decks_router = Router()

@decks_router.get("", response=List[schemas.DeckSchema])
def get_decks(request):
    decks = Deck.objects.all()
    return decks

@decks_router.post("")
def create_deck(request, payload: schemas.DeckSchema):
    Deck.objects.create(**payload.dict())