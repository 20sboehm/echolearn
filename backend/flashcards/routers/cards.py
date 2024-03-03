from ninja import Router
from flashcards.models import Card
from flashcards import schemas
from typing import List

cards_router = Router()

@cards_router.get('', response=List[schemas.CardSchema])
def get_cards(request):
    cards = Card.objects.all()
    return cards