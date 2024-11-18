from ninja import Router
from django.shortcuts import get_object_or_404
from flashcards.models import SharedDeck
from ninja_jwt.authentication import JWTAuth
import flashcards.schemas as sc

shared_router = Router(tags=["Shared"])

@shared_router.get("", response={200: dict}, auth=JWTAuth())
def get_shared_decks(request):
    shared_decks = SharedDeck.objects.filter(shared_with=request.user).select_related('deck')
    
    return {
        "Decks": [sc.GetDeck.from_orm(d.deck) for d in shared_decks]
    }