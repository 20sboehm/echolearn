import json
from ninja import Router
from flashcards.models import Deck, Folder
from django.contrib.auth.models import User
from typing import List
import flashcards.schemas as sc
from django.shortcuts import get_object_or_404

decks_router = Router(tags=["Decks"])

@decks_router.get("", response=List[sc.GetDeck])
def get_decks(request):
    decks = Deck.objects.all()
    return decks

@decks_router.get("/{deck_id}", response=sc.GetDeck)
def get_deck(request, deck_id: int):
    deck = Deck.objects.get(deck_id=deck_id)
    return deck

@decks_router.post("")
def create_deck(request, payload: sc.CreateDeck):
    folder_ref = Folder.objects.get(pk=payload.folder_id)
    owner_ref = User.objects.get(pk=payload.owner_id)

    Deck.objects.create(
        folder=folder_ref,
        owner=owner_ref,
        name=payload.name,
        description=payload.description
    )
    
@decks_router.ptach("/{deck_id}", response={200: sc.GetDeck, 404: str})
def update_deck(request, deck_id: int, payload:sc.UpdateDeck): 
    deck = get_object_or_404(Deck, deck_id = deck_id)
    
    for name, description in payload.dict().items:
        setattr(deck,name,description)  
    deck.save()
    
    return deck