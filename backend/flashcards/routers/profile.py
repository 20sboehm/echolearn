from ninja import Router
from flashcards.models import CustomUser
from flashcards.schemas import GetUser
from ninja_jwt.authentication import JWTAuth

profile_router = Router(tags=["Profile"])

@profile_router.get("/me", response=GetUser, auth=JWTAuth())
def get_profile(request):
    user = request.auth

    return {
        "username": user.username,
        "age": user.age,
        "country": user.country
    }