from django.contrib.auth.models import User
from django.db import models
import datetime
from django.utils.timezone import now

# Maybe cover by Django itself, come back later
# class User(models.Model):
#     user_id = models.AutoField(primary_key=True)
#     name = models.CharField(max_length=255)
#     email = models.CharField(max_length=255)

class Folder(models.Model):
    folder_id = models.AutoField(primary_key=True)
    last_edited = models.DateTimeField(default=now())
    created_at= models.DateTimeField(default=now())
    name = models.CharField(max_length=255, null=False)
    # user_id = models.ForeignKey(User, on_delete=models.CASCADE, null=False, blank=False) 

class Deck(models.Model):
    deck_id = models.AutoField(primary_key=True, null=False)
    name = models.CharField(max_length=255, null=False)
    folder = models.ForeignKey(Folder, on_delete=models.CASCADE, null=False, blank=False)
    last_edited = models.DateTimeField(default=now())
    created_at = models.DateTimeField(default=now())
    statistics = models.IntegerField(null=True, blank=True)
    description = models.TextField(blank=True, null=True)
    # owner = models.ForeignKey(User, on_delete=models.CASCADE, null=False, blank=False)
    
    def __str__(self):
        return self.name

class Card(models.Model):
    card_id = models.AutoField(primary_key=True)
    deck = models.ForeignKey(Deck, on_delete=models.CASCADE)
    question = models.TextField(max_length=255, null=False, blank=False)
    answer = models.TextField(max_length=255, null=False, blank=False)
    last_edited = models.DateTimeField(default=now())
    created_at = models.DateTimeField(default=now())
    last_reviewed = models.DateTimeField(default=now())
    next_review = models.DateTimeField(default=now())
    bucket = models.IntegerField(null=False, blank=False)

    def __str__(self):
        return self.question

class shardDeck(models.Model):
    share_id = models.AutoField(primary_key=True)
    deck_id = models.ForeignKey(Deck, on_delete=models.CASCADE, null=False)
    user_id = models.ForeignKey(User, on_delete=models.CASCADE, null=False)

    class Meta:
        unique_together = ("deck_id", "user_id")