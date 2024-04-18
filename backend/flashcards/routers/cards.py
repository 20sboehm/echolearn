from ninja import Router
from flashcards.models import Card, Deck
from typing import List
import flashcards.schemas as sc

cards_router = Router(tags=["Cards"])

@cards_router.get("", response=List[sc.GetCard])
def get_cards(request):
    cards = Card.objects.all()
    return cards

@cards_router.get("/{card_id}", response=sc.GetCard)
def get_card(request, card_id: int):
    card = Card.objects.get(card_id=card_id)
    return card

@cards_router.post("")
def create_card(request, payload: sc.CreateCard):
    deck_ref = Deck.objects.get(pk=payload.deck_id)

    Card.objects.create(
        deck=deck_ref,
        question=payload.question,
        answer=payload.answer,
        questionvideolink=payload.questionvideolink,
        answervideolink = payload.answervideolink,
        questionimagelink = payload.questionimagelink,
        answerimagelink = payload.answerimagelink,
        questionlatex = payload.questionlatex,
        answerlatex = payload.answerlatex
    )