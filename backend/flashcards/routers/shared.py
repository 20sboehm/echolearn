from ninja import Router
from django.shortcuts import get_object_or_404
from flashcards.models import SharedDeck
from flashcards.schemas import GetSharedDeck  # 请确保导入正确的 Schema
from ninja_jwt.authentication import JWTAuth
import flashcards.schemas as sc

shared_router = Router(tags=["Shared"])

@shared_router.get("", response={200: dict}, auth=JWTAuth())
def get_shared_decks(request):
    # 获取当前用户的所有共享 decks
    shared_decks = SharedDeck.objects.filter(shared_with=request.user).select_related('deck')
    
    # 返回格式化的结果
    return {
        "Decks": [sc.GetDeck.from_orm(d.deck) for d in shared_decks]
    }