from ninja import Router
from django.contrib.auth.models import User
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
            return 400, "Username is required."

        if User.objects.filter(username=username).exists():
            print("Username already exists.")
            return 400, "Username already exists."
        
        if User.objects.filter(email=email).exists():
            print("Email already exists.")
            return 400, "Email already exists."

        user = User.objects.create_user(
            username=username,
            email=email,
            password=password
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