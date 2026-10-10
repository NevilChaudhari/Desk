import os

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from app.database import supabase
from supabase import create_client, Client

app = FastAPI()
load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

print("KEY exists:", SUPABASE_KEY is not None)

supabase: Client = create_client(
    SUPABASE_URL,
    SUPABASE_KEY
)
frontend_url = os.getenv(
    "FRONTEND_URL",
    "http://localhost:3000",
    "http://localhost:5173",
    "https://deskbynevil.vercel.app"
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[frontend_url],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "FastAPI backend is running"}

class SignupRequest(BaseModel):
    username: str
    email: str
    password: str

@app.post("/auth/signup")
def signup(data: SignupRequest):
    try:
        auth_response = supabase.auth.sign_up({
            "email": data.email,
            "password": data.password,
            "email_confirm": False,
        })
        user = auth_response.user
        if not user:
            raise HTTPException(
                status_code=400,
                detail="Supabase did not return a user"
            )
        profile_response = (
            supabase
            .table("users")
            .insert({
                "id": user.id,
                "email": data.email,
                "username": data.username,
            })
            .execute()
        )
        print("PROFILE RESPONSE:", profile_response)
        return {
            "message": "User created successfully",
            "user_id": user.id,
        }
    except Exception as e:
        print("SIGNUP ERROR:", repr(e))
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )
        
class ConnectionManager:
    def __init__(self):
        self.rooms: dict[str, list[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, chat_id: str):
        await websocket.accept()

        if chat_id not in self.rooms:
            self.rooms[chat_id] = []

        self.rooms[chat_id].append(websocket)

    def disconnect(self, websocket: WebSocket, chat_id: str):
        if chat_id in self.rooms:
            if websocket in self.rooms[chat_id]:
                self.rooms[chat_id].remove(websocket)

            if not self.rooms[chat_id]:
                del self.rooms[chat_id]

    async def broadcast(self, chat_id: str, data: dict):
        if chat_id not in self.rooms:
            return

        for connection in self.rooms[chat_id]:
            await connection.send_json(data)

manager = ConnectionManager()

@app.websocket("/ws/{chat_id}")
async def websocket_endpoint(
    websocket: WebSocket,
    chat_id: str
):
    await manager.connect(websocket, chat_id)

    try:
        while True:
            data = await websocket.receive_json()

            print("WEBSOCKET DATA RECEIVED:", data)

            senderUsername = data.get("senderUsername")
            sender = data.get("sender")
            message = data.get("message")
            created_at = data.get("created_at")

            if not sender:
                await websocket.send_json({
                    "error": "Username is required"
                })
                continue

            if not message:
                await websocket.send_json({
                    "error": "Message is required"
                })
                continue

            await manager.broadcast(
                chat_id,
                {
                    "users": {"username": senderUsername},
                    "sender": sender,
                    "message": message,
                    "created_at": created_at,
                }
            )

    except WebSocketDisconnect:
        manager.disconnect(websocket, chat_id)

class userData(BaseModel):
    user_id:str

@app.get('/api/user/{user_id}')
async def getUser(user_id: str):
    res = supabase.table("users").select("*").eq('id', user_id).limit(1).execute()
    if not res.data:
        raise HTTPException(
            status_code=404,
            detail="Data not found"
        )
    return res.data[0]

class Message(BaseModel):
    sender:str
    message:str
    chatId:str

@app.post('/api/sendMessage')
async def getUser(message: Message):
    try:
        print(f'message data received: {message}')
        res = supabase.table('chat').insert({'sender': message.sender, 'message': message.message, 'chatId': message.chatId}).execute()
        if not res.data:
            raise HTTPException(
                status_code=404,
                detail="Data not found"
            )
        return res.data[0]
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )

@app.get('/api/getMessages/{id}')
async def getUser(id: str):
    print(f'get message data {id}')
    res = supabase.table("chat").select("*,users(*)").eq('chatId', id).execute()
    if not res.data:
        raise HTTPException(
            status_code=404,
            detail="Messages not found"
        )
    return res.data

class Group(BaseModel):
    name:str

@app.post('/api/createGroup')
async def getUser(group: Group):
    try:
        print(f'createGroup data received: {group}')
        res = supabase.table('chatIds').insert({}).select('*').execute()
        if not res.data:
            raise HTTPException(
                status_code=404,
                detail="Data not found"
            )
        res2 = supabase.table('group').insert({'chatId': res.data[0].get('id'), 'name': group.name}).execute()
        if not res2.data:
            raise HTTPException(
                status_code=404,
                detail="Data not found"
            )
        return res.data[0]
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )
        
class Member(BaseModel):
    userId:str
    chatId:str

@app.post('/api/addmember')
async def getUser(member: Member):
    try:
        print(f'addMember data received: {member}')
        res = supabase.table('members').insert({'userId': member.userId, 'chatId': member.chatId}).execute()
        if not res.data:
            raise HTTPException(
                status_code=404,
                detail="Data not found"
            )
        return res.data[0]
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )

@app.get('/api/getGroups/{userId}')
async def getGroups(userId: str):
    try:
        print(f'getGroups data received: {userId}')
        res = supabase.table("members").select("*,users(*),group(*)").eq('userId', userId).execute()
        if not res.data:
            raise HTTPException(
                status_code=404,
                detail="Data not found"
            )
        return res.data
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )

@app.get('/api/getMembers/{id}')
async def getUser(id: str):
    res = supabase.table("members").select("*,users(*)").eq('chatId', id).execute()
    if not res.data:
        raise HTTPException(
            status_code=404,
            detail="Messages not found"
        )
    return res.data

class PrivateChat(BaseModel):
    user1:str
    user2:str

@app.post('/api/createPrivateChat')
async def getUser(privateChat: PrivateChat):
    try:
        print(f'addMember data received: {privateChat}')
        res = supabase.table('chatIds').insert({}).select('*').execute()
        if not res.data:
            raise HTTPException(
                status_code=404,
                detail="Data not found"
            )
        res2 = supabase.table('privateChat').insert({'chatId': res.data[0].get('id'), 'user1': privateChat.user1, 'user2': privateChat.user2}).execute()
        if not res2.data:
            raise HTTPException(
                status_code=404,
                detail="Data not found"
            )
        return res.data[0]
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )

@app.get('/api/getPrivateChats/{userId}')
async def getGroups(userId: str):
    try:
        print(f'getGroups data received: {userId}')
        res = supabase.table("privateChat").select("*,""user1:users!privateChat_user1_fkey(*),""user2:users!privateChat_user2_fkey(*)").or_(f"user1.eq.{userId},user2.eq.{userId}").execute()
        if not res.data:
            raise HTTPException(
                status_code=404,
                detail="Data not found"
            )
        return res.data
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )