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
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",  # or another model version like gpt-3.5-turbo or gpt-4
            # prompt=f"Question: {question}\nRéponse:",
            # max_tokens=1024,
            # n=1,
            # stop=["\n"],
            # temperature=0.7,
            messages = [
            {"role": "system", "content": "Please generate a multiple-choice question based on the following topic."},
            {"role": "user", "content": question},
            ]
        )
        print("2")
        response_message = response.choices[0].message.content
        print(response_message)
        return JsonResponse({'answer': response.choices[0].message.content})
    
    except Exception as e:
        print(e)
        print("3")
        return JsonResponse({'error': str(e)}, status=500)
