from typing import Optional
from django.shortcuts import get_object_or_404
from ninja import Router, File
from flashcards.models import CustomUser, Folder, Deck, Rating
from flashcards.schemas import GetUser, UpdateUser, FolderInfo, DeckInfo
from ninja_jwt.authentication import JWTAuth
from botocore.exceptions import ClientError
import boto3
import json
import uuid
from ninja.files import UploadedFile

profile_router = Router(tags=["Profile"])

# Get profile
@profile_router.get("/me", response=GetUser, auth=JWTAuth())
def get_profile(request, userId: int = None):
    user = None
    if userId:
        user = user = get_object_or_404(CustomUser, id=userId)
        is_owner = user.id == request.auth.id
    else:
        user = request.auth
        is_owner = True

    return {
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "age": user.age,
        "country": user.country,
        "flip_mode": user.flip_mode,
        "sidebar_open": user.sidebar_open,
        "light_mode": user.light_mode,
        "avatar": user.avatar,
        "is_owner": is_owner,
    }

# Edit profile
@profile_router.patch("/me", response=GetUser, auth=JWTAuth())
def update_profile(request, data: UpdateUser):
    user = request.auth

    if data.username is not None:
        user.username = data.username
    
    if data.email is not None:
        user.email = data.email

    if data.age is not None:
        user.age = data.age
    
    if data.country is not None:
        user.country = data.country if data.country != " " else None

    if data.flip_mode is not None:
        user.flip_mode = data.flip_mode
    
    if data.sidebar_open is not None:
        user.sidebar_open = data.sidebar_open

    if data.light_mode is not None:
        user.light_mode = data.light_mode

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
def get_folders_and_decks(request, userId: int = None):
    authenticated_user = request.auth

    if userId:
        user = get_object_or_404(CustomUser, id=userId)
    else:
        user = authenticated_user

    folders = Folder.objects.filter(owner=user, parent__isnull=True)
    folder_list = []

    # Loop through folders
    for folder in folders:
        # If the authenticated user is the owner, show all decks
        if authenticated_user.id == user.id:
            folder_list.append(get_folder_data(folder, authenticated_user))
        else:
            # For guests, show only folders with public decks
            public_folder_data = get_folder_data_if_public(folder)
            if public_folder_data:
                folder_list.append(public_folder_data)

    return folder_list

def get_folder_data(folder: Folder, user: Optional[CustomUser]) -> FolderInfo:
    """
    Recursive function to get folder data, including subfolders and decks.
    """
    # Get all decks in the folder (all if user is owner, only public if guest)
    if user and folder.owner == user:
        decks = Deck.objects.filter(folder=folder)
    else:
        decks = Deck.objects.filter(folder=folder, isPublic=True)

    deck_data = [
        DeckInfo(
            deck_id=deck.deck_id,
            parent_folder_id=deck.folder.folder_id,
            name=deck.name,
        ) for deck in decks
    ]

    # Recursively get subfolder data
    subfolders = Folder.objects.filter(parent=folder)
    subfolder_data = [
        get_folder_data(subfolder, user) for subfolder in subfolders
    ]

    return FolderInfo(
        folder_id=folder.folder_id,
        name=folder.name,
        decks=deck_data,
        children=subfolder_data  # Recursively adding subfolders
    )

def get_folder_data_if_public(folder: Folder) -> Optional[FolderInfo]:
    """
    Helper function to check if a folder or its subfolders contain any public decks.
    If the folder contains public decks, returns its data.
    """
    # Check for public decks in this folder
    public_decks = Deck.objects.filter(folder=folder, isPublic=True)
    deck_data = [
        DeckInfo(
            deck_id=deck.deck_id,
            parent_folder_id=deck.folder.folder_id,
            name=deck.name,
        ) for deck in public_decks
    ]

    # Recursively check subfolders for public decks
    subfolders = Folder.objects.filter(parent=folder)
    public_subfolder_found = False
    subfolder_list = []

    for subfolder in subfolders:
        public_subfolder_data = get_folder_data_if_public(subfolder)
        if public_subfolder_data:
            public_subfolder_found = True
            subfolder_list.append(public_subfolder_data)

    # If this folder or any subfolder contains public decks, return folder data
    if public_decks.exists() or public_subfolder_found:
        folder_data = FolderInfo(
            folder_id=folder.folder_id,
            name=folder.name,
            decks=deck_data,
            children=subfolder_list
        )
        return folder_data

    # If neither the folder nor any of its subfolders have public decks, return None
    return None

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

@profile_router.post("/upload_avatar", response={200: dict, 500: str}, auth=JWTAuth())
def upload_avatar(request, avatar: UploadedFile = File(...)):
    with open('config.json') as config_file:
        config = json.load(config_file)

    AWS_ACCESS_KEY_ID = config['AWS_ACCESS_KEY_ID']
    AWS_SECRET_ACCESS_KEY = config['AWS_SECRET_ACCESS_KEY']
    AWS_REGION = config['AWS_REGION']
    AWS_STORAGE_BUCKET_NAME = config['AWS_STORAGE_BUCKET_NAME']

    s3 = boto3.client(
        's3',
        aws_access_key_id=AWS_ACCESS_KEY_ID,
        aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
        region_name=AWS_REGION
    )

    file_extension = avatar.name.split('.')[-1]
    file_name = f"avatars/{request.user.username}/{uuid.uuid4()}.{file_extension}"

    try:
        s3.upload_fileobj(avatar, AWS_STORAGE_BUCKET_NAME, file_name)
    except Exception as e:
        return {"error": "Failed to upload avatar"}, 500

    avatar_url = f"https://{AWS_STORAGE_BUCKET_NAME}.s3-{AWS_REGION}.amazonaws.com/{file_name}"
    
    user = request.user
    user.avatar = avatar_url
    user.save()

    print(f"Saved avatar to user profile: {avatar_url}")
    
    return {"message": "Avatar uploaded successfully", "avatar": avatar_url}