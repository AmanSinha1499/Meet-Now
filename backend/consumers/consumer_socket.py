import asyncio
import json
import io
from json.decoder import JSONDecodeError
from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
from rest_framework.renderers import JSONRenderer
from rest_framework.parsers import JSONParser
from consumers.models import ChatRoom, Message
from consumers.serializers import MessageSerializer
from users.serializers import UserSerializer
from users.models import User

def getSerializedData(serialized_data):
    content = JSONRenderer().render(serialized_data)
    stream = io.BytesIO(content)
    data = JSONParser().parse(stream)
    return data

videoMedia={}
audioMedia={}
class SocketConsumer(WebsocketConsumer):

    def __init__(self, *args, **kwargs):
        super().__init__( *args, **kwargs)
        self.commands = {
        "join room":self.join_room,
        "sending signal":self.send_signal,
        "returning signal":self.return_signal,
        "send new message":self.new_message,
        "audioMedia":self.handle_audio_media,
        "videoMedia":self.handle_video_media,
        "give join permission status":self.handle_join_permission_status,
        "user kick":self.handle_user_kick,
        "user block":self.handle_user_block,
        "get media":self.get_media,
        "get all messages":self.get_all_messages,
        "user left":self.user_left
        }
        

    def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = 'room_%s' % self.room_name
        self.group_id = self.room_name
        self.room = None
        try:
            room = ChatRoom.objects.get(id=self.room_name)
            self.room = room
            async_to_sync(self.channel_layer.group_add)(
                self.room_group_name,
                self.channel_name
            )
            user = self.scope['user']
            self.accept()
            serialized_data = UserSerializer(user).data
            final_data = getSerializedData(serialized_data)
            creator = room.creator

            if user == creator or room.invited_users.filter(id=user.id).exists():
                self.send_message("get permission",{"usable_id":user.id, "status":"accept"})
            else:
                query = room.users.all().filter(id=creator.id)
                if not query:
                    self.send_message("join message","creator not available")
                elif room.blocked_users.filter(id=user.id).exists():
                    self.send_message("join message","user blocked")
                else:
                    self.broadcast("user want to join",{"user":final_data,"usable_id":creator.id})

        except Exception:
            self.accept()
            self.close(code=4000)
            return

        
        

    def disconnect(self, close_code=None):
        self.send(json.dumps({"end_message": close_code}))
        if(close_code == 4000):
            return
        user = self.scope["user"]
        if self.room is not None:
            self.room.users.remove(user)
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name,
            self.channel_name
        )
        serialized_data = UserSerializer(user).data
        final_data = getSerializedData(serialized_data)
        self.broadcast("user left",{"user":final_data})
    
    def join_room(self,roomID):
        user = self.scope["user"]
        self.room.users.add(user)
        users = self.room.users.all().exclude(id=user.id)
        serialized_data = UserSerializer(users,many=True)
        final_data = getSerializedData(serialized_data.data)
        self.send_message("all users",final_data )
    
    def send_signal(self,data):
        user = User.objects.get(pk=data["callerID"])
        serialized_data = UserSerializer(user).data
        final_data = getSerializedData(serialized_data)
        self.broadcast("user joined",{ "signal": data["signal"], "callerUser": final_data, "usable_id":data["userToSignal"] })
    
    def return_signal(self,data):
        user = self.scope["user"]
        userID = user.id
        self.broadcast("receiving returned signal",{ "signal": data["signal"], "id": userID ,"usable_id":data["callerID"]})

    def new_message(self,data):
        user = self.scope["user"]
        room = self.room
        message = Message.objects.create(user=user,message=data,room=room)
        serialized_data = MessageSerializer(message).data
        final_data = getSerializedData(serialized_data)
        self.broadcast("receive new message",final_data)

    def get_all_messages(self,data):
        messages = self.room.messages.all()
        serialized_data = MessageSerializer(messages,many=True).data
        final_data = getSerializedData(serialized_data)
        self.send_message("get all messages",{"messages":serialized_data})
    
    def handle_audio_media(self,data):
        audioMedia[data["userID"]] = data["audioOn"]
        self.broadcast("audioMedia",data)

    def handle_video_media(self,data):
        videoMedia[data["userID"]] = data["videoOn"]
        self.broadcast("videoMedia",data)
    
    def get_media(self,data):
        self.send_message("get media", {"audio":audioMedia,"video":videoMedia})

    
    def handle_join_permission_status(self,data):
        creator = self.scope["user"]
        room =  self.room
        if creator == room.creator:
            if(data["status"]=="accept"):
                user = User.objects.get(pk=data["userID"])    
            self.broadcast("get permission",{"usable_id":data["userID"], "status":data["status"]})
    
    def handle_user_kick(self,data):
        creator = self.scope["user"]
        room = self.room
        if creator == room.creator and creator.id != data["userID"]:
            self.broadcast("user kicked",{"usable_id":data["userID"]})
    
    def handle_user_block(self,data):
        creator = self.scope["user"]
        room = self.room
        if creator == room.creator and creator.id != data["userID"]:
            try:
                user = User.objects.get(id=data["userID"])
                room.blocked_users.add(user)
                self.broadcast("user blocked",{"usable_id":data["userID"]})
            except User.DoesNotExist:
                pass
    
    def user_left(self,data):
        user = self.scope["user"]
        if self.room is not None:
            self.room.users.remove(user)
        serialized_data = UserSerializer(user).data
        final_data = getSerializedData(serialized_data)
        self.broadcast("user left",{"user":final_data})

    def receive(self, text_data):
        data = json.loads(text_data)
        fun = self.commands.get(data['type'],None)
        if fun is not None:
            fun(data['data'])

    def send_message(self,command, content):
        s = json.dumps({"command":command,"data":content})
        self.send(text_data=s)

    def broadcast(self,type, data):
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {
                'type': "mango",
                "command":type,
                'data': data,
            }
        )

    def mango(self,event):
        s = json.dumps({"command":event["command"],"data":event["data"]})
        self.send(text_data=s)