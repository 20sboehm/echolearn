from openai import OpenAI
import json 
from django.http import JsonResponse
from ninja import Router
from flashcards.models import Card,Deck
import re
from django.shortcuts import get_object_or_404

test_router = Router(tags=["Test"])

@test_router.post("", response={200: dict, 404: str})
def test(request):
    api_key = "sk-proj-OczSglC20Vl1pUp7Uv6NT3BlbkFJdQwK8apAZaWYkYvcFHxQ"
    client = OpenAI(api_key=api_key)
    data = json.loads(request.body)
    deckid = data.get("deckid")
    if(len(Deck.objects.get(deck_id = deckid).quiz) != 0):
        return JsonResponse({'quiz': Deck.objects.get(deck_id = deckid).quiz})
    print(len(Deck.objects.get(deck_id = deckid).quiz))
    
    card_list = Card.objects.filter(deck_id = deckid)

    prompt_lines = ["Generate a multiple-choice question with 3 incorrect choices and 1 correct answer for each of the following questions and indicate the question with\" Question\" "+
                    "indicate the answer with \"answer\" associated with each question and choice starts with uper case letter like A),B),C),D) and when you cannot generate you can skip:"]
    for card in card_list:
        prompt_lines.append(f"Question: {card.question}")
        prompt_lines.append(f"Answer: {card.answer}")

    prompt = "\n".join(prompt_lines)
    try:
        response = client.chat.completions.create(
            model="gpt-4",  
            # prompt=f"Question: {question}\nRéponse:",
            # max_tokens=1024,
            # n=1,
            # stop=["\n"],
            # temperature=0.7,
            #send question to got and take answer as one of choice
            messages = [
            {"role": "user", "content": prompt},
            ]
        )

        response_message = response.choices[0].message.content
        print(response_message)
        pattern = re.compile(
            r'Question:\s*(.*?)\s*' +  # Captures the question text
            r'A\)\s*(.*?)\s*' +        # Captures choice A
            r'B\)\s*(.*?)\s*' +        # Captures choice B
            r'C\)\s*(.*?)\s*' +        # Captures choice C
            r'D\)\s*(.*?)\s*' +        # Captures choice D
            r'Answer:\s*([ABCD])\)\s*(.*?)\s*' +  # Captures the answer, handling spaces
            r'(?=Question:|\Z)',       # Positive lookahead for the start of the next question or end of text
            re.DOTALL                  # Allows '.' to match across newlines
        )

        quiz_items = []

        for match in pattern.finditer( response_message):
            question = match.group(1)
            choices = {
                'A': match.group(2),
                'B': match.group(3),
                'C': match.group(4),
                'D': match.group(5)
            }
            answer = match.group(6)
            quiz_items.append({
                'question': question,
                'choices': choices,
                'answer': answer
            })

        for item in quiz_items:
            print(item['question'])
            print('Choices:', item['choices'])
            print('Correct Answer:', item['answer'], '->', item['choices'][item['answer']])
            print()
        deck =get_object_or_404(Deck, deck_id = deckid)
        deck.quiz = quiz_items
        deck.save()
        print(Deck.objects.get(deck_id = deckid).quiz)
        return JsonResponse({'quiz': quiz_items})
    
    except Exception as e:
        print(e)
        print("3")
        return JsonResponse({'error': str(e)}, status=500)
