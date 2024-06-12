from openai import OpenAI
import json 
from django.http import JsonResponse
from ninja import Router
import os


test_router = Router(tags=["Test"])

@test_router.post("", response={200: dict, 404: str})
def test(request):
    api_key = "sk-proj-OczSglC20Vl1pUp7Uv6NT3BlbkFJdQwK8apAZaWYkYvcFHxQ"
    client = OpenAI(api_key=api_key)
    data = json.loads(request.body)
    question = data.get('question')
    print(question)
    if not question:
        return JsonResponse({'error': 'No question provided'}, status=400)

    try:
        response = client.completions.create(
            model="gpt-3.5-turbo",  # or another model version like gpt-3.5-turbo or gpt-4
            prompt=f"Question: {question}\nRéponse:",
            max_tokens=1024,
            n=1,
             stop=["\n"],
            temperature=0.7,
        )
        print("2")
        return JsonResponse({'answer': response.choices[0].text})
    
    except Exception as e:
        print(e)
        print("3")
        return JsonResponse({'error': str(e)}, status=500)
