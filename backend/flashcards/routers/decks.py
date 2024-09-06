from ninja import Router
from flashcards.models import Deck, Folder, Card, CustomUser
from typing import List
import flashcards.schemas as sc
from django.shortcuts import get_object_or_404
from ninja_jwt.authentication import JWTAuth

decks_router = Router(tags=["Decks"])

# ---------------------------------------------
# -------------------- GET --------------------
# ---------------------------------------------

@decks_router.get("", response={200: List[sc.GetDeck]}, auth=JWTAuth())
def get_decks(request):
    decks = Deck.objects.all()
    return decks

@decks_router.get("/{deck_id}", response={200: sc.GetDeck, 404: str}, auth=JWTAuth())
def get_deck(request, deck_id: int):
    deck = get_object_or_404(Deck, deck_id=deck_id)
    return deck

@decks_router.get("/{deck_id}/cards", response={200: sc.DeckCards, 404: str}, auth=JWTAuth())
def get_cards_from_deck(request, deck_id: int):
    deck = get_object_or_404(Deck, deck_id=deck_id)
    card_list = Card.objects.filter(deck_id=deck_id)

    return {"deck_id": deck.deck_id, "deck_name": deck.name, "cards": card_list}

# ---------------------------------------------
# -------------------- POST -------------------
# ---------------------------------------------

@decks_router.post("", response={201: sc.GetDeck, 404: str}, auth=JWTAuth())
def create_deck(request, payload: sc.CreateDeck):

    folder_ref = get_object_or_404(Folder, pk=payload.folder_id)

    if payload.owner_id is None:
        owner_ref = request.user  # Use the authenticated user as the owner
    else:
        owner_ref = get_object_or_404(CustomUser, pk=payload.owner_id)
        
    deck = Deck.objects.create(
        folder=folder_ref,
        owner=owner_ref,
        name=payload.name,
        description=payload.description or "No description provided"
    )
    return 201, deck

# ---------------------------------------------
# -------------------- PATCH ------------------
# ---------------------------------------------

@decks_router.patch("/{deck_id}", response={200: sc.GetDeck, 404: str}, auth=JWTAuth())
def update_deck(request, deck_id: int, payload: sc.UpdateDeck): 
    deck = get_object_or_404(Deck, deck_id=deck_id)
    
    for attribute, value in payload.dict(exclude_unset=True).items():
        if attribute == "folder_id":
            folder_ref = get_object_or_404(Folder, folder_id=value)
            setattr(deck, "folder", folder_ref)  
        else:
            setattr(deck, attribute, value)  
    deck.save()
    
    return deck

# ---------------------------------------------
# -------------------- DELETE -----------------
# ---------------------------------------------

@decks_router.delete("/{deck_id}", response={204: None, 404: str}, auth=JWTAuth())
def delete_deck(request, deck_id: int): 
    deck = get_object_or_404(Deck, deck_id=deck_id)
    
    deck.delete()

    return 204, None