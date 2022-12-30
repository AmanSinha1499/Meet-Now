from django.db import models
from users.models import User
import uuid

class ChatRoom(models.Model):

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    users = models.ManyToManyField(User)
    room_name = models.CharField(max_length=200,blank=True,null=True)
    creator = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='rooms'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    blocked_users = models.ManyToManyField(User,related_name="blocked_rooms")
    invited_users = models.ManyToManyField(User,related_name="invited_rooms")
    def __str__(self):
        room_name = self.room_name
        return f"{room_name}"
    
    class Meta:
        ordering = ['-created_at']