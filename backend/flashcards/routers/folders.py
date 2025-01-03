from ninja import Router
from flashcards.models import Folder, CustomUser
from typing import List
import flashcards.schemas as sc
from django.shortcuts import get_object_or_404
from django.db.models.deletion import ProtectedError
from ninja_jwt.authentication import JWTAuth

folders_router = Router(tags=["Folders"])

# ---------------------------------------------
# -------------------- GET --------------------
# ---------------------------------------------

@folders_router.get("", response={200: List[sc.GetFolder]}, auth=JWTAuth())
def get_folders(request):
    folders = Folder.objects.filter(owner_id=request.user.id)
    return folders

@folders_router.get("/{folder_id}", response={200: sc.GetFolder, 404: str}, auth=JWTAuth())
def get_folder(request, folder_id: int):
    folder = get_object_or_404(Folder, folder_id=folder_id)
    return folder

# ---------------------------------------------
# -------------------- POST -------------------
# ---------------------------------------------

@folders_router.post("", response={201: sc.GetFolder, 404: str}, auth=JWTAuth())
def create_folder(request, payload: sc.CreateFolder):

    owner_ref = request.user  # Use the authenticated user as the owner

    parent_ref = None
    if payload.folder_id is not None:
        parent_ref = get_object_or_404(Folder, pk=payload.folder_id)

    folder = Folder.objects.create(
        name=payload.name,
        owner=owner_ref,
        parent=parent_ref

    )
    return 201, folder

# ---------------------------------------------
# -------------------- PATCH ------------------
# ---------------------------------------------

@folders_router.patch("/{folder_id}", response={200: sc.GetFolder, 404: str}, auth=JWTAuth())
def update_folder(request, folder_id: int, payload:sc.UpdateFolder): 
    folder = get_object_or_404(Folder, folder_id=folder_id)
    
    # `exclude_unset=True` removes any attributes that were not included in the request
    for attribute, value in payload.dict(exclude_unset=True).items():
        setattr(folder, attribute, value)
    
    folder.save()
    
    return folder

@folders_router.patch("/{folder_id}/move", auth=JWTAuth())
def move_folder(request, folder_id: int, target_folder_id: int = None):
    if (folder_id == target_folder_id):
        return {"success": False, "message": "Cannot move folder into itself."}
    
    folder = get_object_or_404(Folder, folder_id=folder_id)

    if target_folder_id is None:
        folder.parent_id = None
    else:
        target_folder = get_object_or_404(Folder, folder_id=target_folder_id)

        # Check if the target folder is a child of the current folder
        if is_parent(folder, target_folder):
            return {"success": False, "message": "Cannot move folder into his childen"}

        # Update the folder's parent folder (or other related field)
        folder.parent_id = target_folder_id

    folder.save()

    return {"success": True, "message": "Folder moved successfully", "folder_id": folder_id, "target_folder_id": target_folder_id}

# ---------------------------------------------
# -------------------- DELETE -----------------
# ---------------------------------------------

@folders_router.delete("/{folder_id}", response={204: None, 404: str, 409: str}, auth=JWTAuth())
def delete_folder(request, folder_id: int): 
    folder = get_object_or_404(Folder, folder_id=folder_id)
    print("here 1")
    
    try:
        folder.delete()
    except ProtectedError as e:
        print(e)
        return 409, "Cannot delete folder with decks in it"

    return 204, None

# ---------------------------------------------
# -------------------- HELPER -----------------
# ---------------------------------------------

def is_parent(folder, target_folder):
    # If the target folder is null, it's not a descendant
    if target_folder is None:
        return False

    # If the target folder's parent is the current folder, it's a descendant
    if target_folder.parent_id == folder.folder_id:
        return True

    # Recursively check the target folder's parent
    return is_parent(folder, target_folder.parent)
