from ninja import Router
from flashcards.models import Deck, Card
from datetime import datetime, timedelta, timezone
import flashcards.schemas as sc
from ninja_jwt.authentication import JWTAuth

review_router = Router(tags=["Review"])

@review_router.get("/{deck_id}", response=sc.ReviewCards, auth=JWTAuth())
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
                "next_review": card.next_review,
                "questionvideolink": card.questionvideolink,
                "answervideolink": card.answervideolink,
                "questionimagelink":card.questionimagelink,
                "answerimagelink":card.answerimagelink,
                "questionlatex":card.questionlatex,
                "answerlatex":card.answerlatex
            })

    return {"deck_id": deck.deck_id, "deck_name": deck.name, "cards": reviewSets}
