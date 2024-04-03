from ninja import Router
from flashcards.models import Folder
from django.contrib.auth.models import User
from typing import List
import flashcards.schemas as sc

folders_router = Router(tags=["Folders"])

@folders_router.get("", response=List[sc.GetFolder])
def get_folders(request):
    folders = Folder.objects.all()
    return folders

@folders_router.get("/{folder_id}", response=sc.GetFolder)
def get_folder(request, folder_id: int):
    folder = Folder.objects.get(folder_id=folder_id)
    return folder

@folders_router.post("")
def create_folder(request, payload: sc.CreateFolder):
    owner_ref = User.objects.get(pk=payload.owner_id)

    Folder.objects.create(
        name=payload.name,
        owner=owner_ref
    )