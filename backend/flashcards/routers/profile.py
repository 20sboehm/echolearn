from ninja import Router
from flashcards.models import CustomUser, Folder, Deck, Rating
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

# Helper function to get folder data recursively
def get_folder_data(folder, user):
    folder_data = FolderInfo(
        folder_id=folder.folder_id,
        name=folder.name,
        decks=[],
        children=[]
    )
    
    # Get current folder's decks
    decks = Deck.objects.filter(folder=folder)
    for deck in decks:
        folder_data.decks.append(DeckInfo(
            deck_id=deck.deck_id,
            name=deck.name,
            parent_folder_id=folder.folder_id
        ))
    
    # Gets the subfolder and calls itself recursively
    children = Folder.objects.filter(parent=folder, owner=user)
    for child in children:
        folder_data.children.append(get_folder_data(child, user))
    
    return folder_data

@profile_router.get("/folders_decks", response=list[FolderInfo], auth=JWTAuth())
def get_folders_and_decks(request):
    user = request.auth
    folders = Folder.objects.filter(owner=user, parent__isnull=True)
    folder_list = []

    # Call the get_folder_data function recursively for each top-level folder
    for folder in folders:
        folder_list.append(get_folder_data(folder, user))
    
    return folder_list

@profile_router.get("/ALLRatedDecks", response=list[dict], auth=JWTAuth())
def ALL_rated_deck(request):
    user = request.user
    rate_existed = Rating.objects.filter(user=user)
    rated_decks = []
    for rating in rate_existed:
        deck = Deck.objects.get(deck_id = rating.deck.deck_id)
        rated_decks.append({
            "deck_id":deck.deck_id,
            "Owner":deck.owner_id,
            "Description":deck.description,
            "name":deck.name
        })
    return 200,rated_decks