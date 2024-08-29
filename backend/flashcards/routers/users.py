from ninja import Router
from typing import List
import flashcards.schemas as sc
from flashcards.models import CustomUser

users_router = Router(tags=["Users"])

# @users_router.get("current_user", response={200: sc.GetUser})
# def get_current_user(request):
#     if request.user.is_authenticated:
#         print("authenticated")
#         return request.user
#         # return {
#         #     "age": request.user.age,
#         #     "country": request.user.country
#         # }
#     else:
#         return {"error": "User is not authenticated"}, 401

@users_router.get("", response={200: List[sc.GetUser]})
def get_users(request):
    users = CustomUser.objects.all()
    return users