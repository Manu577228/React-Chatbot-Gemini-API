from django.db import models

class ChatMessage(models.Model):
    sender = models.CharField(max_length=10)   # "user" or "bot"
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["created_at"]
