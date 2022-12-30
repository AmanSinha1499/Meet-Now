from django.db import models
from users.models import User
from consumers.models.chat_room import ChatRoom

import uuid

class Message(models.Model):

    message=models.TextField()
    user = models.ForeignKey(User,related_name="messages",on_delete=models.CASCADE)
    room = models.ForeignKey(ChatRoom,related_name="messages",on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        room_name = self.room_name
        return f"{room_name}"
    
    class Meta:
        ordering = ['created_at']