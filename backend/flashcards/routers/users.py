from ninja import Router
from typing import List
import flashcards.schemas as sc
from flashcards.models import CustomUser
from ninja_jwt.authentication import JWTAuth

users_router = Router(tags=["Users"])

@users_router.get("", response={200: List[sc.GetUser]}, auth=JWTAuth())
def get_users(request):
    users = CustomUser.objects.all()
    return users