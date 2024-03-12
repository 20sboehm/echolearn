from django.db import models

class Deck(models.Model):
    deck_id = models.IntegerField()
    title = models.CharField(max_length=255)

    def __str__(self):
        return self.title

class Card(models.Model):
    card_id = models.IntegerField()
    deck = models.ForeignKey('Deck', on_delete=models.CASCADE)
    question = models.TextField()
    answer = models.TextField()

    def __str__(self):
        return self.question