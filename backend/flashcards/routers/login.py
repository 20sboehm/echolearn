import json
from ninja import Router
from flashcards.models import Folder
from django.contrib.auth.models import User
from typing import List
import flashcards.schemas as sc
from django.contrib.auth import authenticate, login, logout
from django.shortcuts import redirect, render
from django.http import HttpResponse

login_router = Router(tags=["Login"])

@login_router.post("",response={404:str})
def Log_in(request,payload:sc.GetUser):
    user = authenticate(username = payload.username, password = payload.userpassword)
    if user is None:
        return 404, {"message": "Check your password or username "}
    else:
        login(request,user)
        response_data = {"redirect": "/home"}
        return HttpResponse(json.dumps(response_data),status=200)