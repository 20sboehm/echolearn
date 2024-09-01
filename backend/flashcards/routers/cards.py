from ninja import Router
from flashcards.models import Card, Deck
from typing import List
import flashcards.schemas as sc
from django.shortcuts import get_object_or_404
from ninja_jwt.authentication import JWTAuth

cards_router = Router(tags=["Cards"])

# ---------------------------------------------
# -------------------- GET --------------------
# ---------------------------------------------

# @cards_router.get("/secure-data", auth=JWTAuth())
# def secure_data(request):
#     return {"data": "This is secured data"}

@cards_router.get("", response={200: List[sc.GetCard]}, auth=JWTAuth())
def get_cards(request):
    cards = Card.objects.all()
    return cards

@cards_router.get("/{card_id}", response={200: sc.GetCard, 404: str}, auth=JWTAuth())
def get_card(request, card_id: int):
    card = get_object_or_404(Card, card_id=card_id)
    return card

# ---------------------------------------------
# -------------------- POST -------------------
# ---------------------------------------------

@cards_router.post("", response={201: sc.GetCard, 404: str}, auth=JWTAuth())
def create_card(request, payload: sc.CreateCard):
    deck_ref = get_object_or_404(Deck, pk=payload.deck_id)

    card = Card.objects.create(
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
    return 201, card

# ---------------------------------------------
# -------------------- PATCH ------------------
# ---------------------------------------------

@cards_router.patch("/{card_id}", response={200: sc.GetCard, 404: str}, auth=JWTAuth())
def update_card(request, card_id: int, payload: sc.UpdateCard): 
    card = get_object_or_404(Card, card_id=card_id)
    
    for attribute, value in payload.dict(exclude_unset=True).items():
        if (attribute == "bucket" or attribute == "next_review") and card.is_new == True:
            card.is_new = False
        setattr(card, attribute, value)  
    card.save()
    
    return card

# ---------------------------------------------
# -------------------- DELETE -----------------
# ---------------------------------------------

@cards_router.delete("/{card_id}", response={204: None, 404: str}, auth=JWTAuth())
def delete_card(request, card_id: int): 
    card = get_object_or_404(Card, card_id=card_id)
    
    card.delete()

    return 204, None