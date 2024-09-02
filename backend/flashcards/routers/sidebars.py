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

    user = request.user

    folders = Folder.objects.filter(owner=user)
    
    def get_folder_data(folder):
        folder_data = sc.FolderInfo(
            folder_id=folder.folder_id,
            name=folder.name,
            decks=[],
            children=[]
        )
        
        # Fetch decks belonging to this folder
        decks = Deck.objects.filter(folder=folder)
        for deck in decks:
            folder_data.decks.append(sc.DeckInfo(
                deck_id=deck.deck_id,
                name=deck.name
            ))
        
        # Fetch child folders
        children = Folder.objects.filter(parent_folder=folder, owner=user)
        for child in children:
            folder_data.children.append(get_folder_data(child))
        
        return folder_data
    
    # Iterate over the top-level folders
    for folder in folders:
        if folder.parent_folder is None:  # Ensure it's a top-level folder
            sidebar_data.append(get_folder_data(folder))
    
    return sc.GetSidebar(folders=sidebar_data)
        
