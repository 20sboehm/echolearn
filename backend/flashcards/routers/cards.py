from ninja import Router
from flashcards.models import Card, Deck
from flashcards.schemas import CardSchema
from typing import List

cards_router = Router()

@cards_router.get('', response=List[CardSchema])
def get_cards(request):
    cards = Card.objects.all()
    return cards

@cards_router.post('')
def create_card(request, payload: CardSchema):
    deck_ref = Deck.objects.get(pk=payload.deck_id)

    Card.objects.create(
        card_id=payload.card_id,
        deck=deck_ref,
        question=payload.question,
        answer=payload.answer
    )