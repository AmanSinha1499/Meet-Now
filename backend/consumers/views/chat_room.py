from rest_framework import generics, viewsets, permissions, status,response
from rest_framework.decorators import action
from django.db.models import Q
from rest_framework.response import Response

from django.http import HttpResponse

from consumers.models.chat_room import ChatRoom
from consumers.serializers import ChatRoomSerializer, InvitedRoomSerializer
from users.models import User
from consumers.permissions import IsCreator, IsUserInvited

class ChatRoomViewSet( viewsets.ModelViewSet):
    permission_classes_by_action = {
        'destroy': [IsCreator],
        'update':[IsCreator],
        'default': [permissions.IsAuthenticated],
        'invite':[IsCreator],
        'removeInvite':[IsCreator | IsUserInvited],
    }
    serializer_class = ChatRoomSerializer
    queryset = ChatRoom.objects.all()

    def get_permissions(self):
        try:
            return [permission() for permission in self.permission_classes_by_action[self.action]]
        except KeyError as e:
            return [permission() for permission in self.permission_classes_by_action['default']]
    
    def perform_create(self, serializer):
        user = self.request.user
        data = self.request.data
        name = data.get("room_name",None)
        chat_room = ChatRoom.objects.create(
            creator=user,
            room_name=name
        )
        chat_room.users.add(user)
        chat_room.save()
        return chat_room
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        new_room = self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        final_serializer = self.get_serializer(new_room)
        return response.Response(final_serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def list(self,request):
        queryset = ChatRoom.objects.filter(creator=request.user)
        serializer = ChatRoomSerializer(queryset, many=True)
        return response.Response(serializer.data)

    @action(detail=True, methods=['post'])
    def invite(self,request,pk):
        try:
            room = ChatRoom.objects.get(pk=pk)
        except ChatRoom.DoesNotExist:
            return HttpResponse('Room Not available', status=status.HTTP_400_BAD_REQUEST)
        
        invitee = request.data.get("invitee",None)
        if invitee is None:
            return HttpResponse("invitee field is required",status=status.HTTP_400_BAD_REQUEST)
        
        try:
            invitee_user = User.objects.get(email=invitee)
        except User.DoesNotExist:
            return HttpResponse('user is not registered', status=status.HTTP_400_BAD_REQUEST)
            
        if invitee_user == request.user:
            return HttpResponse('you cannot invite yourself', status=status.HTTP_400_BAD_REQUEST)
        room.invited_users.add(invitee_user)
        room.blocked_users.remove(invitee_user)
        serializer = ChatRoomSerializer(room)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    @action(detail=True,methods=['POST'])
    def removeInvite(self,request,pk):
        try:
            room = ChatRoom.objects.get(pk=pk)
        except ChatRoom.DoesNotExist:
            return HttpResponse('Room Not available', status=status.HTTP_400_BAD_REQUEST)
        
        invitee = request.data.get("invitee",None)
        if invitee is None:
            return HttpResponse("invitee field is required",status=status.HTTP_400_BAD_REQUEST)
        
        try:
            invitee_user = User.objects.get(email=invitee)
        except User.DoesNotExist:
            return HttpResponse('user is not registered', status=status.HTTP_400_BAD_REQUEST)
          
        room.invited_users.remove(invitee_user)
        serializer = ChatRoomSerializer(room)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    @action(detail=True,methods=['get'])
    def isUserCreator(self,request,pk):
        try:
            room = ChatRoom.objects.get(pk=pk)
        except ChatRoom.DoesNotExist:
            return HttpResponse('Room Not available', status=status.HTTP_400_BAD_REQUEST)
        user = request.user
        res = {"isCreator":user == room.creator}
        return Response(res, status=status.HTTP_200_OK)
    
    @action(detail=False,methods=['get'])
    def invitations(self,request):
        queryset = request.user.invited_rooms.all()
        serializer = InvitedRoomSerializer(queryset, many=True)
        return response.Response(serializer.data)