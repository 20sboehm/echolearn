import json
from ninja import Router
from flashcards.models import Deck, Card
from django.contrib.auth.models import User
from datetime import datetime, timedelta, timezone
import flashcards.schemas as sc

review_router = Router(tags=["Review"])

@review_router.get("/{deck_id}", response=sc.ReviewCards)
def get_reviews(request, deck_id: int):
    deck = Deck.objects.get(deck_id=deck_id)

    cards = Card.objects.filter(deck=deck)
    today = datetime.now(timezone.utc)

    reviewSets = []
    for card in cards:
        if card.next_review <= today:
            reviewSets.append({
                "card_id": card.card_id,
                "question": card.question,
                "answer": card.answer,
                "bucket": card.bucket,
                "next_review": card.next_review
            })

    return {"deck_id": deck.deck_id, "deck_name": deck.name, "cards": reviewSets}

# TODO: remove
# @review_router.post("/{card_id}/update", response=sc.GetCard)
# def update_review(request, card_id: int):
#     try:
#         card = Card.objects.get(card_id=card_id)
#     except Card.DoesNotExist:
#         return 404, {"message": "Card not found"}

#     # Extract the time value from the request body
#     body_unicode = request.body.decode('utf-8')
#     body = json.loads(body_unicode)
#     time_value = int(body.get("time_value", 0))

#     # Add the specified time interval to the current next_review time
#     today = datetime.now(timezone.utc)
#     card.next_review = today + timedelta(milliseconds=time_value)
#     card.last_reviewed = today
#     card.save()

#     return card