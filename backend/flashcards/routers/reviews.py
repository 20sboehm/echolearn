from ninja import Router
from flashcards.models import Deck, Card
from datetime import datetime, timedelta, timezone
import flashcards.schemas as sc
from ninja_jwt.authentication import JWTAuth
from ninja.errors import HttpError
import time

review_router = Router(tags=["Review"])

@review_router.get("/{deck_id}", response=sc.ReviewCards, auth=JWTAuth())
def get_reviews(request, deck_id: int, studyAll: bool = False):
    deck = Deck.objects.get(deck_id=deck_id)

    # time.sleep(1)

    if deck.owner != request.user:
        raise HttpError(403, "You are not authorized to access this deck")

    cards = Card.objects.filter(deck=deck)
    today = datetime.now(timezone.utc)

    reviewSets = []
    for card in cards:
        if studyAll or card.next_review <= today:
            reviewSets.append({
                "card_id": card.card_id,
                "question": card.question,
                "answer": card.answer,
                "bucket": card.bucket,
                "correct_count": card.correct_count,
                "incorrect_count": card.incorrect_count,
                "next_review": card.next_review
            })

    return {"deck_id": deck.deck_id, "deck_name": deck.name, "cards": reviewSets}
