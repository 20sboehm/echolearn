from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from typing import List
from ninja import Router, File
from ninja.files import UploadedFile
from ninja_jwt.authentication import JWTAuth
from flashcards.models import Image
from botocore.exceptions import ClientError
import boto3
import json
import flashcards.schemas as sc

images_router = Router(tags=["Images"])

@images_router.get("", response={200: List[sc.GetImage]}, auth=JWTAuth())
def get_images(request):
    images = Image.objects.filter(owner=request.user)
    return images


@images_router.post("/upload", response={200: dict, 500: str}, auth=JWTAuth())
def upload_image(request, image_file: UploadedFile = File(...)):
    with open('config.json') as config_file:
        config = json.load(config_file)

    AWS_ACCESS_KEY_ID = config['AWS_ACCESS_KEY_ID']
    AWS_SECRET_ACCESS_KEY = config['AWS_SECRET_ACCESS_KEY']
    AWS_REGION = config['AWS_REGION']
    AWS_STORAGE_BUCKET_NAME = config['AWS_STORAGE_BUCKET_NAME']

    s3 = boto3.client(
        's3',
        aws_access_key_id = AWS_ACCESS_KEY_ID,
        aws_secret_access_key = AWS_SECRET_ACCESS_KEY,
        region_name = AWS_REGION
    )

    image_obj = Image.objects.create(owner=request.user, name=image_file.name)

    file_extension = image_file.name.rsplit(".", 1)[1]

    file_name = f"uploads/{request.user.username}/{image_obj.image_id}.{file_extension}"

    try:
        s3.upload_fileobj(image_file, AWS_STORAGE_BUCKET_NAME, file_name)
    except Exception as e:
        image_obj.delete()
        return "Something went wrong with the file upload", 500

    image_url = f"https://{AWS_STORAGE_BUCKET_NAME}.s3-us-west-2.amazonaws.com/{file_name}"
    image_obj.link = image_url
    image_obj.save()

    print(f"Uploaded: {image_url}")

    return {"message": "Image uploaded successfully", "image_url": image_url}


@images_router.delete("/delete/{image_id}", response={204: None, 404: str, 500: str}, auth=JWTAuth())
def delete_image(request, image_id: int):
    print("running delete image")

    with open('config.json') as config_file:
        config = json.load(config_file)

    AWS_ACCESS_KEY_ID = config['AWS_ACCESS_KEY_ID']
    AWS_SECRET_ACCESS_KEY = config['AWS_SECRET_ACCESS_KEY']
    AWS_REGION = config['AWS_REGION']
    AWS_STORAGE_BUCKET_NAME = config['AWS_STORAGE_BUCKET_NAME']

    try:
        image_obj = Image.objects.get(image_id=image_id, owner=request.user)
    except Image.DoesNotExist:
        return "Image not found", 404

    file_extension = image_obj.link.rsplit(".", 1)[1]
    file_name = f"uploads/{request.user.username}/{image_obj.image_id}.{file_extension}"

    s3 = boto3.client(
        's3',
        aws_access_key_id=AWS_ACCESS_KEY_ID,
        aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
        region_name=AWS_REGION
    )

    try:
        s3.delete_object(Bucket=AWS_STORAGE_BUCKET_NAME, Key=file_name)
    except Exception as e:
        return f"Error deleting image from S3: {str(e)}", 500

    image_obj.delete()

    return 204, None