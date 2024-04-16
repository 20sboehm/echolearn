from ninja import Router
from flashcards.models import Card, Deck
from typing import List
import flashcards.schemas as sc
from django.shortcuts import get_object_or_404

cards_router = Router(tags=["Cards"])

# ---------------------------------------------
# -------------------- GET --------------------
# ---------------------------------------------

@cards_router.get("", response={200: List[sc.GetCard]})
def get_cards(request):
    cards = Card.objects.all()
    return cards

@cards_router.get("/{card_id}", response={200: sc.GetCard, 404: str})
def get_card(request, card_id: int):
    card = get_object_or_404(Card, card_id=card_id)
    return card

# ---------------------------------------------
# -------------------- POST -------------------
# ---------------------------------------------

@cards_router.post("", response={201: sc.GetCard, 404: str})
def create_card(request, payload: sc.CreateCard):
    deck_ref = get_object_or_404(Deck, pk=payload.deck_id)

    card = Card.objects.create(
        deck=deck_ref,
        question=payload.question,
        answer=payload.answer
    )
    return 201, card

# TODO: remove
# @review_router.post("/{card_id}")
# def update_review(request, card_id: int, payload: sc.UpdateCard):
#     try:
#         card = Card.objects.get(card_id=card_id)
#     except Card.DoesNotExist:
#         return 404, {"message": "Card not found"}

#     # Extract the time value from the request body
#     body_unicode = request.body.decode('utf-8')
#     body = json.loads(body_unicode)
#     time_value = int(body.get("time_value", 0))
#     new_bucket = int(body.get("bucket", 0))

#     # Add the specified time interval to the current next_review time
#     today = datetime.now(timezone.utc)
#     card.next_review = today + timedelta(milliseconds=time_value)
#     card.last_reviewed = today
#     card.bucket = new_bucket

#     if card.is_new == True:
#         card.is_new = False

#     card.save()

#     return card


# ---------------------------------------------
# -------------------- PATCH ------------------
# ---------------------------------------------

@cards_router.patch("/{card_id}", response={200: sc.GetCard, 404: str})
def update_card(request, card_id: int, payload: sc.UpdateCard): 
    card = get_object_or_404(Card, card_id=card_id)
    
    for attribute, value in payload.dict(exclude_unset=True).items():
        if (attribute == "bucket" or attribute == "next_review") and card.is_new == True:
            card.is_new = False
        setattr(card, attribute, value)  
    card.save()
    
    return card

# TODO: remove
# @cards_router.patch("/{card_id}", response={200: sc.GetCard, 404: str})
# def update_card(request, card_id: int, payload: sc.UpdateCard):
#     try:
#         card = Card.objects.get(card_id=card_id)
#     except Card.DoesNotExist:
#         return 404, {"message": "Card not found"}

#     # Extract the time value from the request body
#     body_unicode = request.body.decode('utf-8')
#     body = json.loads(body_unicode)
#     time_value = int(body.get("review_from_now", 0))
#     new_bucket = int(body.get("bucket", 0))

#     # Add the specified time interval to the current next_review time
#     today = datetime.now(timezone.utc)
#     card.next_review = today + timedelta(milliseconds=time_value)
#     card.last_reviewed = today
#     card.bucket = new_bucket

#     if card.is_new == True:
#         card.is_new = False

#     card.save()

#     return card

# ---------------------------------------------
# -------------------- DELETE -----------------
# ---------------------------------------------

@cards_router.delete("/{card_id}", response={204: None, 404: str})
def delete_card(request, card_id: int): 
    card = get_object_or_404(Card, card_id=card_id)
    
    card.delete()

    return 204, None