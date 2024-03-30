from django.contrib.auth.models import User
from django.db import models

class Folder(models.Model):
    folder_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    owner = models.ForeignKey(User, on_delete=models.CASCADE) 
    created_at= models.DateTimeField(auto_now_add=True)
    last_edited = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class Deck(models.Model):
    deck_id = models.AutoField(primary_key=True)
    folder = models.ForeignKey(Folder, on_delete=models.PROTECT) # Cannot delete folder with decks in it
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)
    statistics = models.IntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    last_edited = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.name

class Card(models.Model):
    card_id = models.AutoField(primary_key=True)
    deck = models.ForeignKey(Deck, on_delete=models.CASCADE)
    question = models.TextField(max_length=255)
    answer = models.TextField(max_length=255)
    bucket = models.IntegerField(default=0)
    last_reviewed = models.DateTimeField(auto_now_add=True)
    next_review = models.DateTimeField(auto_now_add=True)
    created_at = models.DateTimeField(auto_now_add=True)
    last_edited = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.question

class SharedDeck(models.Model):
    share_id = models.AutoField(primary_key=True)
    deck_id = models.ForeignKey(Deck, on_delete=models.CASCADE)
    shared_with = models.ForeignKey(User, on_delete=models.CASCADE)

    class Meta:
        unique_together = ("deck_id", "shared_with")

    def __str__(self):
        return self.question