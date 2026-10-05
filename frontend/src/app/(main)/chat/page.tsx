'use client'

import { supabase } from "@/libs/supabase/supabase";
import { Sun, Moon, Plus, Users, ChevronRight, X, Copy } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import CreateGroupModal from "./popup";

type theme = 'Dark' | 'Light'
type Message = {
    sender: string;
    message: string;
    users: User
};
type Member = {
    users: User;
    group: Group
};
type Group = {
    chatId: string;
    name: string;
};
type User = {
    id: string
    username: string
    email: string
}

export default function Chat() {
    const router = useRouter()
    const [showModal, setShowModal] = useState<boolean>(false);
    const [showGroupDetails, setShowGroupDetails] = useState<boolean>(false);
    const [groupMembers, setGroupMembers] = useState<Member[]>([])
    const [user, setUser] = useState<User | null>(null)
    const [userId, setUserId] = useState<string>()
    const [message, setMessage] = useState<string>('')
    const [messages, setMessages] = useState<Message[]>([]);
    const [groups, setGroups] = useState<Member[]>([]);
    const [selectedGroup, setSelectedGroup] = useState<Group>();

    useEffect(() => {
        const getUser = async () => {
            const {
                data: { user },
            } = await supabase.auth.getUser();
            if (user == null) { router.push('/signin'); return; };
            setUserId(user?.id)
            await getUserData(user.id)
        }
        const getUserData = async (id: string) => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/${id}`);
            const data = await res.json();
            setUser(data);
            fetchGroups(id)
        }
        getUser()
    }, [router, supabase])

    const fetchMembers = async (id: string) => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/getMembers/${id}`)
        const data = await res.json()
        if (data.length > 0) {
            setGroupMembers(data);
        }
    }
    const fetchMessages = async (id: string) => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/getMessages/${id}`)
        const data = await res.json()
        if (data.length > 0) {
            setMessages(data);
        }
    }
    const fetchGroups = async (id: string) => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/getGroups/${id}`)
        const data = await res.json()
        if (data.length > 0) {
            setGroups(data);
        }
    }

    useEffect(() => {
        if (selectedGroup) {
            setMessages([])
            fetchMessages(selectedGroup.chatId)
            fetchMembers(selectedGroup.chatId)
        }
    }, [selectedGroup])

    const sendMessage = () => {
        if (!message.trim()) return;
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            socketRef.current.send(
                JSON.stringify({
                    senderUsername: user?.username,
                    sender: userId,
                    message: message,
                })
            );
            async function sendMsg() {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/sendMessage`, {
                    method: 'POST',
                    headers: { "Content-Type": "application/json", },
                    body: JSON.stringify({ sender: userId, message: message, chatId: selectedGroup?.chatId })
                })
            }
            sendMsg()
            setMessage('');
        }
    }
    const socketRef = useRef<WebSocket | null>(null);
    useEffect(() => {
        if(!selectedGroup) return
        const socket = new WebSocket(
            `ws://127.0.0.1:8000/ws/${selectedGroup.chatId}`
        );

        socketRef.current = socket;

        socket.onmessage = (event) => {
            try {
                const data: Message = JSON.parse(event.data);

                setMessages(prev => [...prev, data]);
            } catch (error) {
                console.error(
                    "Failed to parse WebSocket message:",
                    error
                );
            }
        };

        socket.onclose = () => {
            if (socketRef.current === socket) {
                socketRef.current = null;
            }
        };

        return () => {
            socket.close(1000, "Chat changed");

            if (socketRef.current === socket) {
                socketRef.current = null;
            }
        };
    }, [selectedGroup]);

    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const createGroup = async (name: string) => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/createGroup`, {
            method: 'POST',
            headers: { "Content-Type": "application/json", },
            body: JSON.stringify({
                userId: userId,
                name: name
            })
        })
        const data = await res.json()
        if (!data) {
            alert(data.detail)
            return;
        }
        const chatID = await data.chatId;
        const res2 = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/addmember`, {
            method: 'POST',
            headers: { "Content-Type": "application/json", },
            body: JSON.stringify({
                userId: userId,
                chatId: chatID
            })
        })
        const data2 = await res2.json()
        if (!data2) {
            alert(data.detail)
            return;
        }
        fetchGroups(userId ? userId : '')
    }

    const joinGroup = async (id: string) => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/addmember`, {
            method: 'POST',
            headers: { "Content-Type": "application/json", },
            body: JSON.stringify({
                userId: userId,
                chatId: id
            })
        })
        const data = await res.json()
        if (!data) {
            alert(data.detail)
            return;
        }
        fetchGroups(userId ? userId : '')
    }

    return (
        <div className="w-full h-full bg-background flex flex-col text-foreground">
            <div className="absolute">
                {showModal && (<CreateGroupModal
                    open={showModal}
                    onClose={() => setShowModal(false)}
                    onCreate={(group) => {
                        createGroup(group.name)
                    }}
                    onJoin={(group) => {
                        joinGroup(group.id)
                    }}
                />)}
            </div>
            {/* Main */}
            <div className="flex w-full flex-1 h-full">
                {/* Sidebar 2 */}
                <div className="flex flex-col min-w-50 w-[20%] border-r border-border">
                    <div className="flex items-center place-content-between h-15 p-2 mx-5 border-b border-border text-xl">Chats <button onClick={() => setShowModal(!showModal)}><Plus /></button></div>
                    <div className="flex flex-col gap-2 py-2 mx-5">
                        {groups.map((grp, index) => (
                            <div onClick={() => setSelectedGroup(grp.group)} key={index} className={`flex gap-3 items-center cursor-pointer ${selectedGroup?.chatId == grp.group.chatId ? 'bg-[#7F85F5]/50' : 'hover:bg-[#7F85F5]/30'} px-2 py-3 rounded-md`}>
                                <Users />
                                <span className="font-semibold text-xl">{grp.group.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
                {/* Main Window */}
                <div className="flex flex-col flex-1">
                    {selectedGroup && (<div className="flex border-b border-border h-15 px-5 w-full items-center font-semibold text-xl place-content-between">
                        <span>{selectedGroup.name}</span>
                        {!showGroupDetails && (<div onClick={() => setShowGroupDetails(!showGroupDetails)} className={`flex w-10 h-10 items-center justify-center rounded-full ${showGroupDetails ? 'bg-primary/50' : ''} hover:bg-primary/30 cursor-pointer`}><ChevronRight /></div>)}
                    </div>)}
                    <div className="flex-1 overflow-y-auto p-6 h-full slim-scrollbar">
                        {messages.map((msg, index) => (
                            <div key={index} className={`mb-4 ${msg.sender == userId ? 'justify-end' : ''} flex`}>
                                <div className="flex items-center gap-2">
                                    {msg.sender != userId && (<div className={`border cursor-pointer border-border w-10 h-10 rounded-full bg-accent items-center justify-center flex ${msg.sender == userId ? 'text-end' : 'text-start'}`}>{msg.users.username.slice(0,2)}</div>)}
                                    <div className={`p-2 rounded-b-2xl ${msg.sender == userId ? 'bg-blue-400 rounded-l-2xl' : 'bg-purple-400 rounded-r-2xl'}`}>{msg.message}</div>
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                    <div className="flex gap-2 border-t border-border p-4">
                        <input value={message} onChange={(e) => setMessage(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") sendMessage() }} placeholder="Type a message..." className="flex-1 rounded border px-4 py-2 outline-0" />
                        <button onClick={sendMessage} className="rounded bg-foreground px-5 py-2 text-background">Send</button>
                    </div>
                </div>
                {showGroupDetails && (
                    <div className="flex flex-col border-border border-l min-w-100">
                        <div className="flex place-content-between border-b border-border h-15 px-5 w-full items-center font-semibold text-xl">
                            <span>Details</span>
                            {showGroupDetails && (<div onClick={() => setShowGroupDetails(!showGroupDetails)} className={`flex w-10 h-10 items-center justify-center rounded-full hover:bg-primary/30 cursor-pointer`}><X /></div>)}
                        </div>
                        <div className="flex flex-col gap-1 px-5 py-2">
                            <span className="">GroupId:</span>
                            <span title="click to copy!" onClick={() => navigator.clipboard.writeText(selectedGroup?.chatId ?? "")} className="text-blue-400 flex gap-2 items-center cursor-pointer">{selectedGroup?.chatId}<Copy size={15} /></span>
                        </div>
                        <div className="flex flex-col gap-1 px-5 py-2">
                            <span className="">Members:</span>
                            {groupMembers.map((grpmember, index) => (
                                <div key={index}>{grpmember.users.username}</div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}