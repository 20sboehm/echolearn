import datetime
from ninja import Router
from flashcards.models import Deck, Folder, Card, CustomUser,Rating
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
            "name": deck.name,
            "description": deck.description,
            "created_at": deck.created_at.strftime("%d %B %Y"),
            "last_edited": deck.last_edited.strftime("%d %B %Y"),
            "favorites": deck.stars,
        })
    
    return result

@decks_router.get("/{deck_id}", response={200: sc.GetDeck, 404: str}, auth=JWTAuth())
def get_deck(request, deck_id: int):
    deck = get_object_or_404(Deck, deck_id=deck_id)
    return deck

@decks_router.get("/public/{deck_id}/cards", response={200: sc.DeckCards, 404: str}, auth=JWTAuth())
def get_cards_from_deck_public(request, deck_id: int):
    deck = get_object_or_404(Deck, deck_id=deck_id)

    publicAccess = True
    # Check if the deck owner by the user
    if deck.owner == request.user:
        publicAccess = False
    else:
        if deck.isPublic == False:
            raise HttpError(403, "You are not authorized to access this deck")
    
    card_list = Card.objects.filter(deck_id=deck_id)
    
    return {"deck_id": deck.deck_id, "isPublic": deck.isPublic, "deck_name": deck.name, "cards": card_list,"stars": deck.stars, "order_List": deck.order_List, "publicAccess": publicAccess}

@decks_router.get("/{deck_id}/cards", response={200: sc.DeckCards, 404: str}, auth=JWTAuth())
def get_cards_from_deck(request, deck_id: int):
    deck = get_object_or_404(Deck, deck_id=deck_id)

    if deck.owner != request.user:
        raise HttpError(403, "You are not authorized to access this deck")

    card_list = Card.objects.filter(deck_id=deck_id)

    if len(deck.order_List) == 0: 
        print("hererer")
        for card in card_list:
            deck.order_List.append(card.card_id)
            deck.save()
    return {"deck_id": deck.deck_id, "isPublic": deck.isPublic, "deck_name": deck.name, "cards": card_list, "stars":deck.stars, "order_List":deck.order_List}

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

    # if(len(folderList) != 0):
    #     folder_ref = folderList[0]
    # else:
    #     folder_ref = Folder.objects.create(
    #         name = 'default',
    #         owner=owner_ref,
    #         description=deck.description)
   
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
    return {"deck_id": deck.deck_id,"isPublic": deck.isPublic, "deck_name": deck.name, "cards": card_list,"stars":deck.stars, "order_List":deck.order_List}

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