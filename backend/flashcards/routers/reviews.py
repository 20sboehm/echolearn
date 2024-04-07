from ninja import Router
from flashcards.models import Deck, Card
from django.contrib.auth.models import User
from datetime import datetime
import flashcards.schemas as sc

review_router = Router(tags=["Review"])

@review_router.get("/{deck_id}", response=sc.ReviewCards)
def get_reviews(request, deck_id: int):
    deck = Deck.objects.get(deck_id=deck_id)

    cards = Card.objects.filter(deck=deck)
    today = datetime.now(cards.first().next_review.tzinfo)
    print("Today:", today)


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

    return {"deck_id": deck.deck_id, "cards": reviewSets}