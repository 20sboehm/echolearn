from ninja import Router
from flashcards.models import Folder, Deck
from django.contrib.auth.models import User
from typing import List
import flashcards.schemas as sc
from ninja_jwt.authentication import JWTAuth

sidebar_router = Router(tags=["Sidebar"])

# Right now it get all the folder without care who the user is
@sidebar_router.get("", response=sc.GetSidebar, auth=JWTAuth())
def get_sidebar_info(request):
    sidebar_data = []
    folders = Folder.objects.filter(owner_id=1)
    for folder in folders:
        folder_data = sc.FolderInfo(
            folder_id=folder.folder_id,
            name=folder.name,
            decks=[]
        )
        decks = Deck.objects.filter(folder=folder)
        for deck in decks:
            folder_data.decks.append(sc.DeckInfo(
                deck_id=deck.deck_id,
                name=deck.name
            ))
        sidebar_data.append(folder_data)
    return sc.GetSidebar(Folders=sidebar_data)
        
