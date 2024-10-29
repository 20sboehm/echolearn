import json 
from django.http import JsonResponse
from ninja import Router
from flashcards.models import Card,Deck
import random

quiz_router = Router(tags=["Quiz"])

@quiz_router.get("/{deck_id}", response={200: dict, 404: str})
def quiz(request, deck_id: int):

    deck = Deck.objects.get(deck_id=deck_id)
    # Get all cards in the deck
    card_list = list(Card.objects.filter(deck_id=deck_id))
    quiz_items = []

    # Check if there are enough cards to generate a quiz
    if len(card_list) < 4:
        return JsonResponse({})  # Not enough cards to create a quiz

    # Generate quiz for each card
    for i, card in enumerate(card_list):
        question = card.question

        # Get a list of wrong answers excluding the current card's answer
        wrong_indices = [index for index in range(len(card_list)) if index != i]

        # Sample 3 wrong answers from the remaining cards
        wrong_choices = random.sample(wrong_indices, 3)
        
        # Collect wrong answers
        choiceList = [card_list[n].answer for n in wrong_choices]
        
        # Add the correct answer
        choiceList.append(card.answer)

        # Shuffle the answer choices to randomize the correct answer position
        random.shuffle(choiceList)

        # Add the question, choices, and correct answer to the quiz items
        quiz_items.append({
            'question': question,
            'choices': choiceList,
            'answer': card.answer
        })
        
        random.shuffle(quiz_items)

    return JsonResponse({'quiz': quiz_items, 'deck_name': deck.name})


    # card_list = Card.objects.filter(deck_id = deck_id)
    # quiz_items = []
    # if(len(card_list) < 4):
    #     return JsonResponse({})  
    
    # choiceList = []
    # numbers = list(range(0, len(card_list)))
    # r1 = random.sample(numbers, 3)
    # for i in range(len(card_list)): 
    #     while i in r1:
    #         r1 = random.sample(numbers, 3)
    #     question = card_list[i].question
    #     choiceList = []
    #     for n in r1:
    #         choiceList.append(card_list[n].answer)
    #     choiceList.append(card_list[i].answer)
    #     random.shuffle(choiceList)
    #     quiz_items.append({'question': question, 'choices': choiceList, 'answer': card_list[i].answer})
    # return JsonResponse({'quiz': quiz_items})
