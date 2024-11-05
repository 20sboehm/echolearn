from django.contrib.auth.models import AbstractUser
from django.contrib.postgres.fields import JSONField
from django.db import models
"""
Models define the structure of your application's data. Each model corresponds to a table in the database.
Each attribute of the model corresponds to a column in that table.
"""

class CustomUser(AbstractUser):
    age = models.IntegerField(null=True, blank=True)
    country = models.TextField(null=True, blank=True)
    flip_mode = models.BooleanField(default=True)
    sidebar_open = models.BooleanField(default=True)
    light_mode = models.BooleanField(default=False)
    avatar = models.URLField(blank=True, null=True)
    rank = models.IntegerField(default=0)
    
    def __str__(self):
        return self.username

class Folder(models.Model):
    folder_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    owner = models.ForeignKey(CustomUser, on_delete=models.CASCADE) 
    created_at = models.DateTimeField(auto_now_add=True)
    last_edited = models.DateTimeField(auto_now_add=True)
    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='children')

    def __str__(self):
        return f"{self.name} (id={self.folder_id})"

class Deck(models.Model):
    deck_id = models.AutoField(primary_key=True)
    folder = models.ForeignKey(Folder, on_delete=models.PROTECT) # Cannot delete folder with decks in it
    owner = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True) # blank=True allows this to be an empty string
    statistics = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    last_edited = models.DateTimeField(auto_now_add=True)
    isPublic = models.BooleanField(default=False)
    stars =  models.IntegerField(default=0)
    order_List =  models.JSONField(default=list, blank=True)
    def __str__(self):
        return f"{self.name} (id={self.deck_id})"

class Rating(models.Model):
    deck = models.ForeignKey(Deck,on_delete=models.CASCADE)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    stars = models.IntegerField(default=0)
    
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
    is_new = models.BooleanField(default=True)
    correct_count = models.IntegerField(default=0)
    incorrect_count = models.IntegerField(default=0)
    review_history = models.JSONField(default=list, blank=True)
    review_again = models.BooleanField(default=False)
    ease_factor_points = models.FloatField(default=0)
    ease_factor_max_points = models.FloatField(default=0)
    target_recall = models.FloatField(default=0.9)

    def __str__(self):
        return f"{self.question} (id={self.card_id})"

class Image(models.Model):
    image_id = models.AutoField(primary_key=True)
    owner = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    link = models.CharField(max_length=1000, default="")
    name = models.CharField(max_length=300)
    description = models.TextField(blank=True)

class SharedDeck(models.Model):
    share_id = models.AutoField(primary_key=True)
    deck = models.ForeignKey(Deck, on_delete=models.CASCADE)
    shared_with = models.ForeignKey(CustomUser, on_delete=models.CASCADE)

    class Meta:
        unique_together = ("deck_id", "shared_with")

    def __str__(self):
        return f"share_id={self.share_id}, deck={self.deck}, shared_with={self.shared_with}"

# -----------------------------------------------
# ------------------ Friend list ----------------
# -----------------------------------------------

class Friendship(models.Model):
    PENDING = 'pending'
    ACCEPTED = 'accepted'

    STATUS_CHOICES = [
        (PENDING, 'Pending'),
        (ACCEPTED, 'Accepted'),
    ]

    user = models.ForeignKey(CustomUser, related_name='friends', on_delete=models.CASCADE)
    friend = models.ForeignKey(CustomUser, related_name='friends_of', on_delete=models.CASCADE)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default=PENDING)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'friend')

    def __str__(self):
        return f"Friendship ({self.status}) between {self.user.username} and {self.friend.username}"