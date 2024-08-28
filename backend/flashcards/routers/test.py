from openai import OpenAI
import json 
from django.http import JsonResponse
from ninja import Router
from flashcards.models import Card,Deck
import random

test_router = Router(tags=["Test"])

@test_router.get("/{deck_id}", response={200: dict, 404: str})
def test(request,deck_id:int):

    card_list = Card.objects.filter(deck_id = deck_id)
    quiz_items = []
    if(len(card_list) <4):
        return JsonResponse({})  
    
    choiceList = []
    numbers = list(range(0, len(card_list)))
    r1 = random.sample(numbers, 3)
    for i in range(len(card_list)): 
        while i in r1:
            r1 = random.sample(numbers, 3)
        question = card_list[i].question
        choiceList = []
        for n in r1:
            choiceList.append(card_list[n].answer)
        choiceList.append(card_list[i].answer)
        random.shuffle(choiceList)
        quiz_items.append({'question':question,'choices':choiceList,'answer':card_list[i].answer})
    return JsonResponse({'quiz': quiz_items})
    
