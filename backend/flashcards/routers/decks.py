import datetime
from ninja import Router
from flashcards.models import Deck, Folder, Card, CustomUser,Rating, SharedDeck, Rated
from typing import List
import flashcards.schemas as sc
from django.shortcuts import get_object_or_404
from ninja_jwt.authentication import JWTAuth
from django.http import JsonResponse
from ninja.errors import HttpError
import json
decks_router = Router(tags=["Decks"])

# ---------------------------------------------
# -------------------- GET --------------------
# ---------------------------------------------

@decks_router.get("", response={200: List[sc.GetDeck]}, auth=JWTAuth())
def get_decks(request):
    decks = Deck.objects.filter(owner_id=request.user.id)
    return decks

@decks_router.get("/AllPublicDecks", response={200: List[sc.GetPublicDeck]}, auth=JWTAuth())
def get_ALL_decks(request):
    decks = Deck.objects.filter(isPublic=True).select_related("owner")
    
    result = []
    for deck in decks:
        print(deck)
        result.append({
            "deck_id": deck.deck_id,
            "owner_username": deck.owner.get_username(),
            "owner_id": deck.owner_id,
            "name": deck.name,
            "description": deck.description,
            "created_at": deck.created_at.strftime("%d %B %Y"),
            "last_edited": deck.last_edited.strftime("%d %B %Y"),
            "favorites": deck.stars,
            "rate": deck.rate,
        })
    
    return result

@decks_router.get("/{deck_id}", response={200: sc.GetDeck, 404: str}, auth=JWTAuth())
def get_deck(request, deck_id: int):
    deck = get_object_or_404(Deck, deck_id=deck_id)
    return deck

@decks_router.get("/public/{deck_id}/cards", response={200: sc.DeckCards, 404: str}, auth=JWTAuth())
def get_cards_from_deck_public(request, deck_id: int):
    deck = get_object_or_404(Deck, deck_id=deck_id)
    is_shared = SharedDeck.objects.filter(deck=deck, shared_with=request.user).exists()

    publicAccess = True
    # Check if the deck owner by the user
    if deck.owner == request.user or is_shared:
        publicAccess = False
    else:
        if deck.isPublic == False:
            raise HttpError(403, "You are not authorized to access this deck")
    
    card_list = Card.objects.filter(deck_id=deck_id)

    return {"deck_id": deck.deck_id, "isPublic": deck.isPublic, "deck_name": deck.name,"deckdescription":deck.description, "cards": card_list,"stars": deck.stars, "order_List": deck.order_List, "publicAccess": publicAccess, "rate": deck.rate}

@decks_router.get("/{deck_id}/cards", response={200: sc.DeckCards, 404: str}, auth=JWTAuth())
def get_cards_from_deck(request, deck_id: int):
    deck = get_object_or_404(Deck, deck_id=deck_id)
    is_shared = SharedDeck.objects.filter(deck=deck, shared_with=request.user).exists()

    if deck.owner != request.user:
        raise HttpError(403, "You are not authorized to access this deck")

    card_list = Card.objects.filter(deck_id=deck_id)

    if len(deck.order_List) == 0: 
        print("hererer")
        for card in card_list:
            deck.order_List.append(card.card_id)
            deck.save()

    return {"deck_id": deck.deck_id, "isPublic": deck.isPublic, "deckdescription":deck.description, "deck_name": deck.name, "cards": card_list, "stars":deck.stars, "order_List":deck.order_List, "rate": deck.rate}

@decks_router.get("/{deck_id}/ratedOrnot", response={200: bool, 404: str}, auth=JWTAuth())
def checkRatedresult(request, deck_id: int):
    
    deck = get_object_or_404(Deck, deck_id=deck_id)
    user = request.user
    try:
        result = Rating.objects.get(deck = deck,user = user)
        return True
    except Rating.DoesNotExist:     
        return False


@decks_router.get("/{deck_id}/take_copy/{folder_id}", response={201: sc.GetDeck, 404: str}, auth=JWTAuth())
def copy_deck(request, deck_id:int,folder_id:int):
    deck = get_object_or_404(Deck, deck_id=deck_id)
    owner_ref = request.user
    folder_ref = get_object_or_404(Folder,folder_id=folder_id)
   
    newdeck = Deck.objects.create(
        folder=folder_ref,
        owner=owner_ref,
        name=deck.name,
        description=deck.description, 
    )
    old_cards = Card.objects.filter(deck = deck.deck_id)
    for oldcard in old_cards:
        newcard = oldcard
        newcard.pk = None
        newcard.deck = newdeck
        newcard.created_at = datetime.datetime.now
        newcard.last_edited = datetime.datetime.now
        newcard.bucket = 0
        newcard.correct_count = 0
        newcard.incorrect_count = 0
        newcard.save()
    return 201, deck

@decks_router.post("/cards", response={201: sc.GetCard, 404: str}, auth=JWTAuth())
def create_card(request, payload: sc.CreateCard):
    deck_ref = get_object_or_404(Deck, pk=payload.deck_id)

    card = Card.objects.create(
        deck=deck_ref,
        question=payload.question,
        answer=payload.answer,
        # questionvideolink=payload.questionvideolink or "",  
        # answervideolink=payload.answervideolink or "",  
        # questionimagelink=payload.questionimagelink or "",  
        # answerimagelink=payload.answerimagelink or "",  
        # questionlatex=payload.questionlatex or "",  
        # answerlatex=payload.answerlatex or ""  
    )
    return 201, card


# ---------------------------------------------
# -------------------- POST -------------------
# ---------------------------------------------

@decks_router.post("", response={201: sc.GetDeck, 404: str}, auth=JWTAuth())
def create_deck(request, payload: sc.CreateDeck):

    folder_ref = None
    if payload.folder_id is not None:
        folder_ref = get_object_or_404(Folder, pk=payload.folder_id)

    owner_ref = request.user  # Use the authenticated user as the owner
        
    deck = Deck.objects.create(
        folder=folder_ref,
        owner=owner_ref,
        name=payload.name,
        description=payload.description or "No description provided"
    )
    return 201, deck

@decks_router.post("/{deck_id}/updateStatus", response={200: sc.DeckCards, 404: str}, auth=JWTAuth())
def update_deck_status(request, deck_id:int):

    deck = get_object_or_404(Deck, deck_id=deck_id)
    deck.isPublic = not deck.isPublic
    deck.save()
    card_list = Card.objects.filter(deck_id=deck_id)

    return {"deck_id": deck.deck_id,"isPublic": deck.isPublic,"deckdescription":deck.description, "deck_name": deck.name, "cards": card_list,"stars":deck.stars, "order_List":deck.order_List, "rate": deck.rate}

@decks_router.post("/{deck_id}/ratings", response={200: dict, 404: str}, auth=JWTAuth())
def rate_deck(request, deck_id: int):
    deck = get_object_or_404(Deck, deck_id=deck_id)
    user = request.user
    try:
        rate_existed = Rating.objects.get(deck=deck, user=user)
        if(not deck.stars < 0):
            deck.stars -=1
            deck.save()
            
        rate_existed.delete()
        
        return {
            "deck_id": deck.deck_id,
            "user": user.id,  
            "status":'removed'
        }
    except Rating.DoesNotExist:
        rate = Rating.objects.create(deck=deck, user=user, stars=1) 
        deck.stars +=1
        deck.save()
        return {
            "deck_id": deck.deck_id,
            "user": user.id,  # or user.id
            "status":'updated'
        }


@decks_router.post("/{deck_id}/generate-share-link", response={200:None, 404: str}, auth=JWTAuth())
def generate_share_link(request, deck_id):
    deck = get_object_or_404(Deck, deck_id=deck_id)
    if deck:
        link = f'localhost:5173/decks/{deck_id}'
        return JsonResponse({
            "link": link
        }, status=200)
    else:
        return 404
    
@decks_router.post("/{deck_id}/orderList", response={200:None, 404: str}, auth=JWTAuth())
def store_new_order_list(request, deck_id):
    deck = get_object_or_404(Deck, deck_id=deck_id)
    data = json.loads(request.body)
   
    if deck:
        print("The type of body is", type(data['templist']))
        print(data['templist'])
        deck.order_List = data['templist']
        deck.save()
        return JsonResponse({
            "neworderlist": deck.order_List
        }, status=200)
    else:
        return 404
    
    
@decks_router.post("/{deck_id}/editall", response={200:None, 404: str}, auth=JWTAuth())
def editall(request, deck_id):
    deck = get_object_or_404(Deck, deck_id=deck_id)
    data = json.loads(request.body)
    
    newitems = data.get("newItems")
    
    deck.name = data.get("newdeckname")
    deck.description = data.get("newdeckdescription")
    deck.save()
    
    if deck:
        cardList = Card.objects.filter(deck=deck)
        card_map = {card.card_id: card for card in cardList}
        for item in newitems:
            if(item["card_id"] in card_map):
                card = card_map[item["card_id"]]
                card.question = item["question"]
                card.answer = item["answer"]
                card.save()
       
        return JsonResponse({
            "neworderlist": deck.order_List
        }, status=200)
    else:
        return 404
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

@decks_router.patch("/{deck_id}/move", auth=JWTAuth())
def move_deck(request, deck_id: int, target_folder_id: int = None):
    deck = get_object_or_404(Deck, deck_id=deck_id)
    print(deck)
    
    # Moving into orginal folder do nothing
    if (deck.folder_id == target_folder_id):
        return 
    
    deck.folder_id = target_folder_id
    deck.save()

    return {"success": True, "message": "Deck moved successfully", "deck_id": deck_id, "target_folder_id": target_folder_id}

# ---------------------------------------------
# -------------------- DELETE -----------------
# ---------------------------------------------

@decks_router.delete("/{deck_id}", response={204: None, 404: str}, auth=JWTAuth())
def delete_deck(request, deck_id: int): 
    deck = get_object_or_404(Deck, deck_id=deck_id)
    
    deck.delete()

    return 204, None

# ---------------------------------------------
# -------------------- SHARE ------------------
# ---------------------------------------------
@decks_router.post("/{deck_id}/share/{user_id}", response={201: str, 404: str}, auth=JWTAuth())
def share_deck(request, deck_id: int, user_id: int):
    deck = get_object_or_404(Deck, deck_id=deck_id)
    shared_with_user = get_object_or_404(CustomUser, id=user_id)
    
    # Check if the deck owner is the current user
    if deck.owner != request.user:
        raise HttpError(403, "You are not authorized to share this deck")

    # Create or update the SharedDeck entry
    shared_deck, created = SharedDeck.objects.update_or_create(
        deck=deck,
        shared_from=request.user,
        shared_with=shared_with_user,
        defaults={'deck': deck, 'shared_from': request.user, 'shared_with': shared_with_user}
    )

    if created:
        message = "Deck shared successfully."
    else:
        message = "Deck sharing updated successfully."

    return 201, message

# Check if shared
@decks_router.get("/{deck_id}/is_shared/{user_id}", response={200: bool, 404: str}, auth=JWTAuth())
def is_deck_shared(request, deck_id: int, user_id: int):
    shared = SharedDeck.objects.filter(deck=deck_id, shared_from=request.user, shared_with_id=user_id).exists()
    return shared

# Delete share
@decks_router.delete("/{deck_id}/unshare/{user_id}", response={200: str, 404: str}, auth=JWTAuth())
def unshare_deck(request, deck_id: int, user_id: int):
    shared_deck = get_object_or_404(SharedDeck, deck_id=deck_id, shared_from=request.user, shared_with_id=user_id)
    shared_deck.delete()
    return "Deck unshared successfully"

# ---------------------------------------------
# -------------------- RATE -------------------
# ---------------------------------------------
@decks_router.get("/{deck_id}/getRate", response={200: float, 404: str}, auth=JWTAuth())
def get_deck_rate(request, deck_id: int):
    deck = get_object_or_404(Deck, deck_id=deck_id)
    return 200, float(deck.rate)

@decks_router.post("/{deck_id}/setRate/{point}", response={200: str, 404: str}, auth=JWTAuth())
def set_deck_rate(request, deck_id: int, point: float):
    # Validate the rating point to ensure it's between 0 and 5, with one decimal place
    if point < 0.0 or point > 5.0:
        return 404, "Invalid rating. Must be between 0.0 and 5.0."

    deck = get_object_or_404(Deck, deck_id=deck_id)
    user = request.user

    # Create or update the rating in the Rated model
    Rated.objects.update_or_create(
        deck=deck,
        user=user,
        defaults={"rate": point}
    )

    # Calculate the new average rating for the deck
    all_ratings = Rated.objects.filter(deck=deck).values_list("rate", flat=True)
    average_rating = round(sum(all_ratings) / len(all_ratings), 1) if all_ratings else 0.0

    # Update the deck's average rating
    deck.rate = average_rating
    deck.save()

    return 200, "Rating set successfully and average updated."