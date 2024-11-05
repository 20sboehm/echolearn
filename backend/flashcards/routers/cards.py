from django.http import JsonResponse
from ninja import Router
from flashcards.models import Card, Deck, CustomUser
from typing import List
import flashcards.schemas as sc
from django.shortcuts import get_object_or_404
from ninja_jwt.authentication import JWTAuth
from ninja.errors import HttpError
from django.db import transaction
from datetime import datetime, timezone, timedelta
import math
import json

cards_router = Router(tags=["Cards"])

# ---------------------------------------------
# ------------------ HELPERS ------------------
# ---------------------------------------------

def get_next_review_time(card, confidence_level: int, bucket: int):
    
    # ----- Parameters -----
    
    if (card.ease_factor_max_points != 0):
        ease = card.ease_factor_points / card.ease_factor_max_points # 0.0 - 1.0
    else:
        ease = 1.0
    
    target_recall = card.target_recall
    if (card.correct_count + card.incorrect_count == 0):
        curr_recall = target_recall # We just want the multiplier for this to be 1.0 if the card is new
    else:
        curr_recall = card.correct_count / (card.correct_count + card.incorrect_count)
    
    # ----- Calculate Next Review Time -----
    
    confidence_multipliers = {
        1: 0.5,
        2: 0.75,
        3: 1.0,
        4: 1.5,
    }
    
    one_day = timedelta(days=1)
    
    bucket_mult = math.pow(2.1, bucket)
    confidence_mult = confidence_multipliers[confidence_level]
    ease_factor_mult = ease + ((1 - ease) / 2)
    recall_mult = 1 - (target_recall - curr_recall)
    
    time_until_next_review = one_day * bucket_mult * confidence_mult * ease_factor_mult * recall_mult
    
    current_time_utc = datetime.now(timezone.utc)
    next_review_time = current_time_utc + time_until_next_review
    
    return next_review_time


def format_time_difference(start_time, end_time):
    # Time difference in seconds
    time_diff = (end_time - start_time).total_seconds()

    # Convert seconds to days
    days = int(time_diff // (60 * 60 * 24))

    # Convert remaining seconds to hours
    hours = int((time_diff % (60 * 60 * 24)) // (60 * 60))

    # Convert remaining seconds to minutes and round to nearest minute
    minutes = round((time_diff % (60 * 60)) / 60)

    formatted_time = ''
    if days > 0:
        formatted_time += f"{days}d "
    if hours > 0 and days <= 4:
        formatted_time += f"{hours}h "
    if days == 0 and hours <= 4:
        formatted_time += f"{minutes}m"

    return formatted_time.strip()

# ---------------------------------------------
# -------------------- GET --------------------
# ---------------------------------------------

@cards_router.get("/review_times/{card_id}", response={200: sc.GetReviewTimes, 404: str}, auth=JWTAuth())
def get_review_times(request, card_id: int): 
    card = get_object_or_404(Card, card_id=card_id)
    
    current_utc_time = datetime.now(timezone.utc)
    
    again_time = get_next_review_time(card, 1, card.bucket)
    hard_time = get_next_review_time(card, 2, card.bucket)
    good_time = get_next_review_time(card, 3, card.bucket)
    easy_time = get_next_review_time(card, 4, card.bucket)
    
    review_times = {
        "again": format_time_difference(current_utc_time, again_time),
        "hard": format_time_difference(current_utc_time, hard_time),
        "good": format_time_difference(current_utc_time, good_time),
        "easy": format_time_difference(current_utc_time, easy_time)
    }
    
    return review_times

@cards_router.get("", response={200: List[sc.GetCard]}, auth=JWTAuth())
def get_cards(request):
    cards = Card.objects.all()
    return cards

@cards_router.get("/{card_id}", response={200: sc.GetCard, 404: str}, auth=JWTAuth())
def get_card(request, card_id: int):
    card = get_object_or_404(Card, card_id=card_id)

    if card.deck.owner != request.user:
        raise HttpError(403, "You are not authorized to access this deck")

    return card

# ---------------------------------------------
# -------------------- POST -------------------
# ---------------------------------------------

@cards_router.post("/create/multiple", response={200: None, 404: str}, auth=JWTAuth())
def create_multiple_cards(request,payload:sc.CreateMultipleCard):
    data = json.loads(request.body)
    card_data = data['cards']

    
    for card in card_data:
        deck_id = card_data[0]["deck_id"]
        deck = Deck.objects.get(pk=deck_id)
        card = Card.objects.create(deck=deck, question=card['question'], answer=card['answer'])
        deck.order_List.append(card.card_id)
        deck.save()
        print(deck.order_List)

    return 200, None

@cards_router.post("", response={201: sc.GetCard, 404: str}, auth=JWTAuth())
def create_card(request, payload: sc.CreateCard):
    deck_ref = get_object_or_404(Deck, pk=payload.deck_id)

    card = Card.objects.create(
        deck=deck_ref,
        question=payload.question,
        answer=payload.answer
    )
    deck_ref.order_List.append(card.card_id)
    deck_ref.save()
    for order in deck_ref.order_List:
        print("order" + str(order))
    return 201, card

# ---------------------------------------------
# -------------------- PATCH ------------------
# ---------------------------------------------

@cards_router.patch("/review/{card_id}", response={200: sc.GetCard, 404: str}, auth=JWTAuth())
def update_review_card(request, card_id: int, payload: sc.UpdateReviewCard): 
    card = get_object_or_404(Card, card_id=card_id)
    
    current_utc_time = datetime.now(timezone.utc)
    
    card.last_reviewed = current_utc_time
    
    confidence_level = payload.confidence
    
    user = request.auth
    
    if confidence_level == 1:
        card.review_again = True
        card.incorrect_count += 1
        #if incorrect -1
        if user.rank >0:
            user.rank -=1
        
    elif confidence_level in [2, 3, 4]:
        if confidence_level == 2:
            card.ease_factor_points += 0.5
        else:
            card.ease_factor_points += 1
        
        # if correct +1
        user.rank += 1
        card.correct_count += 1
        
    # if review +1
    user.rank +=1
    
    card.ease_factor_max_points += 1
    
    if card.is_new:
        card.is_new = False
    
    if card.review_again:
        bucket = 0 # Do calculation with bucket=0 just for this review
        card.review_again = False
    else:
        bucket = card.bucket
    
    if not card.review_history:
        card.review_history = []
    card.review_history.append(current_utc_time.isoformat())
    
    card.save()
    
    card.next_review = get_next_review_time(card, confidence_level=confidence_level, bucket=bucket)
    
    # Update bucket after calculating next review time
    if confidence_level == 1 and card.bucket > 0:
        card.bucket -= 1
    elif confidence_level in [2, 3, 4]:
        card.bucket += 1
    
    card.save()
    
    return card

@cards_router.patch("/{card_id}", response={200: sc.GetCard, 404: str}, auth=JWTAuth())
def update_card(request, card_id: int, payload: sc.UpdateCard): 
    card = get_object_or_404(Card, card_id=card_id)
    
    # if 'last_reviewed' in payload.dict(exclude_unset=True):
    #     review_time = payload.last_reviewed.isoformat()
    #     if not card.review_history:
    #         card.review_history = []
    #     card.review_history.append(review_time)
    
    for attribute, value in payload.dict(exclude_unset=True).items():
        setattr(card, attribute, value)  

    card.save()
    
    return card

# ---------------------------------------------
# -------------------- DELETE -----------------
# ---------------------------------------------

@cards_router.delete("/{card_id}", response={204: None, 404: str}, auth=JWTAuth())
def delete_card(request, card_id: int): 
    card = get_object_or_404(Card, card_id=card_id)
    deck_ref = card.deck
    deck_ref.order_List.remove(card.card_id)
    deck_ref.save()
    card.delete()
    
    return 204, None