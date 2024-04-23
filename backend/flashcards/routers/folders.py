from ninja import Router
from flashcards.models import Folder
from typing import List
import flashcards.schemas as sc
from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User

folders_router = Router(tags=["Folders"])

# ---------------------------------------------
# -------------------- GET --------------------
# ---------------------------------------------

@folders_router.get("", response={200: List[sc.GetFolder]})
def get_folders(request):
    folders = Folder.objects.all()
    return folders

@folders_router.get("/{folder_id}", response={200: sc.GetFolder, 404: str})
def get_folder(request, folder_id: int):
    folder = get_object_or_404(Folder, folder_id=folder_id)
    return folder

# ---------------------------------------------
# -------------------- POST -------------------
# ---------------------------------------------

@folders_router.post("", response={201: sc.GetFolder, 404: str})
def create_folder(request, payload: sc.CreateFolder):
    owner_ref = get_object_or_404(User, pk=payload.owner_id)

    folder = Folder.objects.create(
        name=payload.name,
        owner=owner_ref
    )
    return 201, folder

# ---------------------------------------------
# -------------------- PATCH ------------------
# ---------------------------------------------

@folders_router.patch("/{folder_id}", response={200: sc.GetFolder, 404: str})
def update_folder(request, folder_id: int, payload:sc.UpdateFolder): 
    folder = get_object_or_404(Folder, folder_id=folder_id)
    
    # `exclude_unset=True` removes any attributes that were not included in the request
    for attribute, value in payload.dict(exclude_unset=True).items():
        setattr(folder, attribute, value)
    
    folder.save()
    
    return folder

# ---------------------------------------------
# -------------------- DELETE -----------------
# ---------------------------------------------

@folders_router.delete("/{folder_id}", response={204: None, 404: str})
def delete_folder(request, folder_id: int): 
    folder = get_object_or_404(Folder, folder_id=folder_id)
    
    folder.delete()

    return 204, None