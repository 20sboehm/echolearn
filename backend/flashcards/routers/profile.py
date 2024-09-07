from ninja import Router
from flashcards.models import CustomUser
from flashcards.schemas import GetUser
from ninja.security import django_auth

profile_router = Router(tags=["Profile"])

# 获取当前用户的个人资料
@profile_router.get("/me", response=GetUser, auth=django_auth)
def get_profile(request):
    # 获取当前用户
    user = request.auth  # `request.auth` 是经过身份验证的用户

    # 返回用户的 age 和 country
    return {
        "age": user.age,
        "country": user.country
    }