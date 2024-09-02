# -----
# this is no longer necessary due to built in ninja jwt functionality
# -----




# import json
# from ninja import Router
# import flashcards.schemas as sc
# from django.contrib.auth import authenticate, login, logout
# from django.http import HttpResponse
# from ninja_jwt.authentication import JWTAuth

# login_router = Router(tags=["Login"])

# @login_router.post("", response={404: str})
# def Log_in(request, payload: sc.UserLogin):
#     user = authenticate(username = payload.username, password = payload.userpassword)
#     if user is None:
#         return 404, {"message": "Check your username or password"}
#     else:
#         login(request,user)
#         response_data = {"redirect": "/home"}
#         return HttpResponse(json.dumps(response_data),status=200)