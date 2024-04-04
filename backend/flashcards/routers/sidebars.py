from ninja import Router
from flashcards.models import Folder, Deck
from django.contrib.auth.models import User
from typing import List
import flashcards.schemas as sc

router = Router()

# Right now it get all the folder without care who the user is
@router.get("/", response=sc.GetSidebar)
def get_sidebarinfo(request):
    sidebar_data = []
    folders = Folder.objects.all()
    for folder in folders:
        folder_data = {
            "folder_id": folder.folder_id,
            "name": folder.name,
            "decks": []
        }
        decks = Deck.objects.filter(folder=folder)
        for deck in decks:
            folder_data["decks"].append({
                "deck_id": deck.deck_id,
                "name": deck.name
        })
        sidebar_data.append(folder_data)
    return sidebar_data
        
