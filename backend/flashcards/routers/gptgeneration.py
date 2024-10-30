from openai import OpenAI
import json 
from django.http import JsonResponse
from ninja import Router
from flashcards.models import Card,Deck
import re
from django.shortcuts import get_object_or_404

gpt_router = Router(tags=["Test"])

@gpt_router.post("", response={200: dict, 404: str})
def test(request):
    api_key = "sk-proj-OczSglC20Vl1pUp7Uv6NT3BlbkFJdQwK8apAZaWYkYvcFHxQ"
    client = OpenAI(api_key=api_key)
    data = json.loads(request.body)

    deckid = data.get("deckId")
    userinput = data.get("userinput")

    prompt_lines = [
    "Generate a list of questions and answers about a topic. Format each entry as follows:",
    "Question: <the question> Answer: <the answer>",
    "Example: Question: What is the capital of France? Answer: The capital of France is Paris."
    ]
    prompt_lines.append(f"Input: {userinput}")
    prompt = "\n".join(prompt_lines) + "\n" + f"Input: {userinput}"
    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",  
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
        print(response_message.replace('\n',''))
        
        pattern = re.compile(r'Question:\s*(.*?)\s*Answer:\s*(.*?)(?=Question:|$)', re.DOTALL)
        matches = pattern.findall(response_message.replace('\n',''))

        for question, answer in matches:
            print(f"Question: {question}\nAnswer: {answer}\n")
        qa_pairs = []

        deck = get_object_or_404(Deck, deck_id=deckid)
        for  question, answer in matches:
            card = Card.objects.create(deck=deck, question=question, answer=answer)
            deck.order_List.append(card.card_id)
            deck.save()
            qa_pairs.append({'Question':question,'Answer':answer})
            
        print(qa_pairs)
        return JsonResponse({"newcardset":qa_pairs})
    
    except Exception as e:
        print(e)
        return JsonResponse({'error': str(e)}, status=500)
