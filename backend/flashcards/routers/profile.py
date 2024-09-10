from ninja import Router
from flashcards.models import CustomUser, Folder, Deck
from flashcards.schemas import GetUser, UpdateUser, FolderInfo, DeckInfo
from ninja_jwt.authentication import JWTAuth

profile_router = Router(tags=["Profile"])

# Get profile
@profile_router.get("/me", response=GetUser, auth=JWTAuth())
def get_profile(request):
    user = request.auth

    return {
        "username": user.username,
        "email": user.email,
        "age": user.age,
        "country": user.country
    }

# Edit profile
@profile_router.patch("/me", response=GetUser, auth=JWTAuth())
def update_profile(request, data: UpdateUser):
    user = request.auth

    if data.age is not None:
        user.age = data.age
    
    if data.country is not None:
        user.country = data.country if data.country != "" else None
    
    user.save()
    return user

@profile_router.get("/folders_decks", response=list[FolderInfo], auth=JWTAuth())
def get_folders_and_decks(request):
    user = request.auth
    folders = Folder.objects.filter(owner=user)
    folder_list = []
    
    for folder in folders:
        decks = Deck.objects.filter(folder=folder)
        deck_list = [DeckInfo(deck_id=deck.deck_id, name=deck.name) for deck in decks]
        folder_list.append(FolderInfo(folder_id=folder.folder_id, name=folder.name, decks=deck_list))
    
    return folder_list