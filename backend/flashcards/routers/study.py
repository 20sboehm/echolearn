from ninja import Router
from flashcards.models import Deck, Card
import flashcards.schemas as sc
from ninja_jwt.authentication import JWTAuth
from ninja.errors import HttpError

study_router = Router(tags=["Study"])

@study_router.get("/", response=sc.MultipleReviewCards)
def get_simple_study_cards(request, deckIds: str = None):
    if deckIds:
        deck_ids = [int(id) for id in deckIds.split(',')]
    else:
        raise HttpError(400, "There is no deck to study")

    reviewSets = []

    for deck_id in deck_ids:
        try:
            deck = Deck.objects.get(deck_id=deck_id)

            # 检查是否为公共卡片，移除所有者验证
            if not deck.isPublic:
                raise HttpError(403, "You are not authorized to access this deck")

            cards = Card.objects.filter(deck=deck)
            deckStudySet = []

            for card in cards:
                deckStudySet.append({
                    "card_id": card.card_id,
                    "question": card.question,
                    "answer": card.answer,
                    "bucket": card.bucket,
                    "correct_count": card.correct_count,
                    "incorrect_count": card.incorrect_count,
                    "next_review": card.next_review
                })

            if deckStudySet:
                reviewSets.append({
                    "deck_id": deck.deck_id,
                    "deck_name": deck.name,
                    "cards": deckStudySet
                })

        except Deck.DoesNotExist:
            raise HttpError(404, f"Deck with id {deck_id} does not exist")

    return {"decks": reviewSets}