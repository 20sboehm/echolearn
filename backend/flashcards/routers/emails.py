from django.http import JsonResponse
from ninja import Router
from django.shortcuts import get_object_or_404
from typing import List
from ninja_jwt.authentication import JWTAuth
from flashcards.models import CustomUser
from botocore.exceptions import ClientError
import boto3
import json
import flashcards.schemas as sc

emails_router = Router(tags=["Emails"])

@emails_router.post("/update-notification-settings", response={200: dict, 500: dict}, auth=JWTAuth())
def update_notification_settings(request, payload: sc.UpdateNotificationSettings):
    with open('config.json') as config_file:
        print("opened")
        config = json.load(config_file)
    
    AWS_ACCESS_KEY_ID = config['AWS_ACCESS_KEY_ID']
    AWS_SECRET_ACCESS_KEY = config['AWS_SECRET_ACCESS_KEY']
    AWS_REGION = config['AWS_REGION']
    AWS_DYNAMO_TABLE_NAME = config['AWS_DYNAMO_TABLE_NAME']
    
    dynamodb = boto3.resource(
        'dynamodb',
        aws_access_key_id = AWS_ACCESS_KEY_ID,
        aws_secret_access_key = AWS_SECRET_ACCESS_KEY,
        region_name = AWS_REGION
    )
    notification_settings_table = dynamodb.Table(AWS_DYNAMO_TABLE_NAME)

    response = notification_settings_table.put_item(
        Item={
            'userId': str(request.user.id),
            'userEmail': request.user.email,
            'wantsNotification': payload.wants_notification,
            'notificationTime': payload.notification_time,
        }
    )
    return 200, {"message": "Settings saved successfully"}
    
    
@emails_router.get("/get-notification-settings", response={200: sc.GetNotificationSettings, 404: dict}, auth=JWTAuth())
def get_notification_settings(request):
    with open('config.json') as config_file:
        config = json.load(config_file)

    AWS_ACCESS_KEY_ID = config['AWS_ACCESS_KEY_ID']
    AWS_SECRET_ACCESS_KEY = config['AWS_SECRET_ACCESS_KEY']
    AWS_REGION = config['AWS_REGION']
    AWS_DYNAMO_TABLE_NAME = config['AWS_DYNAMO_TABLE_NAME']

    dynamodb = boto3.resource(
        'dynamodb',
        aws_access_key_id=AWS_ACCESS_KEY_ID,
        aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
        region_name=AWS_REGION
    )
    notification_settings_table = dynamodb.Table(AWS_DYNAMO_TABLE_NAME)

    response = notification_settings_table.get_item(
        Key={'userId': str(request.user.id)}
    )
    
    # If the item exists in DynamoDB, return it
    if 'Item' in response:
        return 200, {
            "wants_notification": response['Item'].get('wantsNotification'),
            "notification_time": response['Item'].get('notificationTime')
        }
    else:
        return 200, {
            "wants_notification": False,
            "notification_time": ""
        }
