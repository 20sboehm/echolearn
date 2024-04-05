from django.http import JsonResponse
from ninja import Router
from flashcards.models import Card, Deck
from typing import List
import flashcards.schemas as sc
import json

cards_router = Router(tags=["Cards"])

@cards_router.get("", response=List[sc.GetCard])
def get_cards(request):
    cards = Card.objects.all()
    return cards

@cards_router.post("")
def create_card(request, payload: sc.CreateCard):
    deck_ref = Deck.objects.get(pk=payload.deck_id)

    Card.objects.create(
        deck=deck_ref,
        question=payload.question,
        answer=payload.answer
    )
  
@cards_router.post("/create")  
def get_onlineEdtor(request):
    data = json.loads(request.body)
    before_text = data.get('beforeText', '')
    selected_text = data.get('selectedText', '')
    after_text = data.get('afterText', '')

    # Apply bold formatting to the selected text
    formatted_text = f"{before_text}<strong>{selected_text}</strong>{after_text}"

    return JsonResponse({'formattedText': formatted_text})

@cards_router.get("/{card_id}", response=sc.GetCard)
def get_card(request, card_id: int):
    card = Card.objects.get(card_id=card_id)
    return card

def check_markdown():
    
    return