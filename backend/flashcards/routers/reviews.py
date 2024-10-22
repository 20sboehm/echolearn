from ninja import Router
from flashcards.models import Deck, Card
from datetime import datetime, timedelta, timezone
import flashcards.schemas as sc
from ninja_jwt.authentication import JWTAuth
from ninja.errors import HttpError
import time

review_router = Router(tags=["Review"])

@review_router.get("/", response=sc.MultipleReviewCards, auth=JWTAuth())
def get_reviews(request, deckIds: str = None, studyAll: bool = False):
    if deckIds:
        deck_ids = [int(id) for id in deckIds.split(',')]
    else:
        raise HttpError(400, "deckIds query parameter is required")

    # time.sleep(1)

    reviewSets = []
    today = datetime.now(timezone.utc)

    for deck_id in deck_ids:
        try:
            deck = Deck.objects.get(deck_id=deck_id)
            
            if deck.owner != request.user:
                raise HttpError(403, "You are not authorized to access this deck")
            
            cards = Card.objects.filter(deck=deck)
            deckReviewSet = []

            for card in cards:
                if studyAll or card.next_review <= today:
                    deckReviewSet.append({
                        "card_id": card.card_id,
                        "question": card.question,
                        "answer": card.answer,
                        "bucket": card.bucket,
                        "correct_count": card.correct_count,
                        "incorrect_count": card.incorrect_count,
                        "next_review": card.next_review
                    })
                    # Add the review set for the deck
            if deckReviewSet:
                reviewSets.append({
                    "deck_id": deck.deck_id,
                    "deck_name": deck.name,
                    "cards": deckReviewSet
                })

        except Deck.DoesNotExist:
            raise HttpError(404, f"Deck with id {deck_id} does not exist")
    
    return {"decks": reviewSets}
