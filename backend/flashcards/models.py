from django.contrib.auth.models import User
from django.db import models

class Folder(models.Model):
    folder_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    owner = models.ForeignKey(User, on_delete=models.CASCADE) 
    created_at= models.DateTimeField(auto_now_add=True)
    last_edited = models.DateTimeField(auto_now_add=True)
    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='children')

    def __str__(self):
        return f"{self.name} (id={self.folder_id})"

class Deck(models.Model):
    deck_id = models.AutoField(primary_key=True)
    folder = models.ForeignKey(Folder, on_delete=models.PROTECT) # Cannot delete folder with decks in it
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True) # blank=True allows this to be an empty string
    statistics = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    last_edited = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.name} (id={self.deck_id})"

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
        return f"{self.question} (id={self.card_id})"

class SharedDeck(models.Model):
    share_id = models.AutoField(primary_key=True)
    deck = models.ForeignKey(Deck, on_delete=models.CASCADE)
    shared_with = models.ForeignKey(User, on_delete=models.CASCADE)

    class Meta:
        unique_together = ("deck_id", "shared_with")

    def __str__(self):
        return f"share_id={self.share_id}, deck={self.deck}, shared_with={self.shared_with}"
