from django.contrib import admin
from flashcards.models import Deck, Card, Folder, shardDeck

admin.site.register(Deck)
admin.site.register(Card)
admin.site.register(Folder)
admin.site.register(shardDeck)
