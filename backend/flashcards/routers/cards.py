import json
from ninja import Router
from flashcards.models import Card, Deck
from typing import List
import flashcards.schemas as sc
from django.shortcuts import get_object_or_404

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
        answer=payload.answer
    )
    
    
@cards_router.ptach("/{card_id}", response={200: sc.GetCard, 404: str})
def update_card(request, card_id: int, payload:sc.UpdateCard):
 
    card = get_object_or_404(Card, card_id = card_id)
    
    for question, answer in payload.dict().items:
        setattr(card,question,answer)  
    card.save()
    
    return card

   