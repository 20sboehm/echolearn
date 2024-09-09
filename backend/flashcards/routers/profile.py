from ninja import Router
from flashcards.models import CustomUser
from flashcards.schemas import GetUser, UpdateUser
from ninja_jwt.authentication import JWTAuth

profile_router = Router(tags=["Profile"])

# Get profile
@profile_router.get("/me", response=GetUser, auth=JWTAuth())
def get_profile(request):
    user = request.auth

    return {
        "username": user.username,
        "email": user.email,
        "age": user.age,
        "country": user.country
    }

# Edit profile
@profile_router.patch("/me", response=GetUser, auth=JWTAuth())
def update_profile(request, data: UpdateUser):
    user = request.auth

    if data.age is not None:
        user.age = data.age
    
    if data.country is not None:
        user.country = data.country if data.country != "" else None
    
    user.save()
    return user