from ninja import Router
# from django.contrib.auth.models import User
from flashcards.models import CustomUser, Folder, Deck, Card
from django.contrib.auth.hashers import make_password
from django.http import JsonResponse
import json

signup_router = Router(tags=["SignUp"])

@signup_router.post("", response={201: None, 400: str})
def sign_up(request):
    try:
        data = json.loads(request.body)
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')

        print(f"Received data: username={username}, email={email}")

        if not username:
            print("No username provided.")
            return JsonResponse({"detail": "No name."}, status=409)
        
        if not email:
            print("No email provided")
            return JsonResponse({"detail": "Empty email."}, status=409)
        
        if not password:
            print("No password provid")
            return JsonResponse({"detail": "Require password."}, status=409)

        if CustomUser.objects.filter(username=username).exists():
            print("Username already exists.")
            return JsonResponse({"detail": "Username already exists."}, status=409)
        
        if CustomUser.objects.filter(email=email).exists():
            print("Email already exists.")
            return JsonResponse({"detail": "Email already exists."}, status=409)

        user = CustomUser.objects.create_user(
            username=username,
            email=email,
            password=password
        )

        default_foler = Folder.objects.create(
            name="Library",
            owner=user
        )

        default_deck = Deck.objects.create(
            name="Default deck",
            owner=user,
            folder=default_foler
        )

        Card.objects.create(
            deck=default_deck,
            question="question1",
            answer="answer1"
        )

        Card.objects.create(
            deck=default_deck,
            question="question2",
            answer="answer2"
        )

        print(f"**User created successfully: {user.username}")

        return JsonResponse({
            "id": user.id,
            "username": user.username,
            "email": user.email
        }, status=201)
    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return 500, "An error occurred during registration."