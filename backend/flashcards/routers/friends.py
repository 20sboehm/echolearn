from ninja import Router
from flashcards.models import CustomUser, Friendship
from typing import List
from flashcards.schemas import GetUser
from ninja_jwt.authentication import JWTAuth

friends_router = Router(tags=["Friends"])

# 获取好友列表
@friends_router.get("", response={200: List[GetUser]}, auth=JWTAuth())
def get_friends(request):
    print("Getting Friends")
    user = request.user
    # 查询 Friendship 表，获取当前用户的好友列表
    friendships = Friendship.objects.filter(user=user)
    friends = [friendship.friend for friendship in friendships]
    return friends

# 删除好友
@friends_router.delete("/{friend_id}/delete", response={204: None, 404: str}, auth=JWTAuth())
def remove_friend(request, friend_id: int):
    print("Delet Friends")
    try:
        # 查找要删除的好友关系
        friendship = Friendship.objects.get(user=request.user, friend_id=friend_id)
        friendship.delete()
        return 204, None
    except Friendship.DoesNotExist:
        return 404, "Friendship not found"

# 搜索好友
@friends_router.get("/search/{query}", response={200: List[GetUser], 404: str}, auth=JWTAuth())
def search_users(request, query: str):
    print(f"Search query: {query}")
    users = CustomUser.objects.filter(username__icontains=query).exclude(id=request.user.id)
    if users.exists():
        return users
    return 404, "No users found"

# 添加好友
@friends_router.post("/{friend_id}/add", response={200: None, 404: str}, auth=JWTAuth())
def add_friend(request, friend_id: int):
    print("Add Friends")
    try:
        friend = CustomUser.objects.get(id=friend_id)
        # 检查是否已经是好友
        if Friendship.objects.filter(user=request.user, friend=friend).exists():
            return 400, "You are already friends"
        # 创建好友关系
        Friendship.objects.create(user=request.user, friend=friend)
        return 200, None
    except CustomUser.DoesNotExist:
        return 404, "User not found"