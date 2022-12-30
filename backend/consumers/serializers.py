from rest_framework import serializers

from consumers.models import ChatRoom, Message
from users.serializers import UserSerializer

class ChatRoomSerializer(serializers.ModelSerializer):
    invited_users = UserSerializer(many=True,read_only=True)
    class Meta:
        model = ChatRoom
        fields = ['id', 'room_name','invited_users']

class InvitedRoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatRoom
        fields = ['id', 'room_name']

class MessageSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    class Meta:
        model = Message
        fields=['user','message']