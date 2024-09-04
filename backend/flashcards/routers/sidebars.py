from ninja import Router
from flashcards.models import Folder, Deck
from django.contrib.auth.models import User
from typing import List
import flashcards.schemas as sc
from ninja_jwt.authentication import JWTAuth

sidebar_router = Router(tags=["Sidebar"])

@sidebar_router.get("", response=sc.GetSidebar, auth=JWTAuth())
def get_sidebar_info(request):
    sidebar_data = []
    
    folders = Folder.objects.filter(owner_id=request.user.id)
    def get_folder_data(folder):
        folder_data = sc.FolderInfo(
            folder_id=folder.folder_id,
            name=folder.name,
            decks=[],
            children=[]
        )
        
        # Getting all the decks of the current folder
        decks = Deck.objects.filter(folder=folder)
        for deck in decks:
            folder_data.decks.append(sc.DeckInfo(
                deck_id=deck.deck_id,
                name=deck.name
            ))
        
        # Fetch child folders
        children = Folder.objects.filter(parent=folder, owner_id=request.user.id)
        for child in children:
            folder_data.children.append(get_folder_data(child))
        
        return folder_data
    
    # Adding all the top-level folder
    for folder in folders:
        if folder.parent is None:
            sidebar_data.append(get_folder_data(folder))

    return sc.GetSidebar(folders=sidebar_data)
