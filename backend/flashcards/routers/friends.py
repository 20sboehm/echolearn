from ninja import Router
from flashcards.models import CustomUser, Friendship
from flashcards.schemas import GetUser
from typing import List, Dict
from ninja_jwt.authentication import JWTAuth

friends_router = Router(tags=["Friends"])

@friends_router.get("", response={200: dict}, auth=JWTAuth())
def get_friends(request):
    """Retrieve friends and pending friend requests."""
    friends = Friendship.objects.filter(user=request.user, status='accepted')
    pending_requests = Friendship.objects.filter(friend=request.user, status='pending')
    return {
        "friends": [GetUser.from_orm(f.friend) for f in friends],
        "pendingRequests": [GetUser.from_orm(r.user) for r in pending_requests]
    }

@friends_router.delete("/{friend_id}/delete", response={204: None, 404: str}, auth=JWTAuth())
def remove_friend(request, friend_id: int):
    """Remove friendship (bidirectional deletion)."""
    try:
        friendship = Friendship.objects.get(user=request.user, friend_id=friend_id)
        reverse_friendship = Friendship.objects.get(user_id=friend_id, friend=request.user)
        friendship.delete()
        reverse_friendship.delete()
        return 204, None
    except Friendship.DoesNotExist:
        return 404, "Friendship not found"

@friends_router.get("/search/{query}", response={200: List[Dict]}, auth=JWTAuth())
def search_users(request, query: str):
    """Search users and return their status (friend, pending)."""
    users = CustomUser.objects.filter(username__icontains=query).exclude(id=request.user.id)
    friends = Friendship.objects.filter(user=request.user, status='accepted').values_list('friend_id', flat=True)
    reverse_friends = Friendship.objects.filter(friend=request.user, status='accepted').values_list('user_id', flat=True)
    sent_requests = Friendship.objects.filter(user=request.user, status='pending').values_list('friend_id', flat=True)
    received_requests = Friendship.objects.filter(friend=request.user, status='pending').values_list('user_id', flat=True)

    result = [
        {
            "id": user.id,
            "username": user.username,
            "status": (
                'friend' if user.id in friends or user.id in reverse_friends else
                'pending_sent' if user.id in sent_requests else
                'pending_received' if user.id in received_requests else
                'none'
            )
        }
        for user in users
    ]
    return result

@friends_router.post("/{friend_id}/add", response={200: None, 404: str}, auth=JWTAuth())
def add_friend(request, friend_id: int):
    """Add a friend directly (bidirectional relationship)."""
    try:
        friend = CustomUser.objects.get(id=friend_id)
        if Friendship.objects.filter(user=request.user, friend=friend).exists():
            return 400, "You are already friends"
        Friendship.objects.create(user=request.user, friend=friend)
        Friendship.objects.create(user=friend, friend=request.user)
        return 200, None
    except CustomUser.DoesNotExist:
        return 404, "User not found"

@friends_router.post("/{friend_id}/request", response={200: None, 404: str}, auth=JWTAuth())
def send_friend_request(request, friend_id: int):
    """Send a friend request."""
    try:
        friend = CustomUser.objects.get(id=friend_id)
        if Friendship.objects.filter(user=request.user, friend=friend).exists():
            return 400, "Request already sent or you are already friends"
        Friendship.objects.create(user=request.user, friend=friend, status='pending')
        return 200, None
    except CustomUser.DoesNotExist:
        return 404, "User not found"

@friends_router.post("/{friend_id}/accept", response={200: None, 404: str}, auth=JWTAuth())
def accept_friend_request(request, friend_id: int):
    """Accept a friend request and establish a bidirectional relationship."""
    try:
        friendship = Friendship.objects.get(user=friend_id, friend=request.user, status='pending')
        friendship.status = 'accepted'
        friendship.save()
        Friendship.objects.create(user=request.user, friend=friendship.user, status='accepted')
        return 200, None
    except Friendship.DoesNotExist:
        return 404, "Friend request not found"

@friends_router.delete("/{friend_id}/reject", response={204: None, 404: str}, auth=JWTAuth())
def reject_friend_request(request, friend_id: int):
    """Reject a friend request."""
    try:
        friendship = Friendship.objects.get(user=friend_id, friend=request.user, status='pending')
        friendship.delete()
        return 204, None
    except Friendship.DoesNotExist:
        return 404, "Friend request not found"