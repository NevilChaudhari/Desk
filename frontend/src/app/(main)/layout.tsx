'use client'

import { supabase } from "@/libs/supabase/supabase";
import { Sun, Moon, ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type theme = 'Dark' | 'Light'
type User = {
    id: string
    username: string
    email: string
}

export default function Main({ children }: LayoutProps<"/">) {
    const router = useRouter()

    const [theme, setTheme] = useState<theme>('Dark')
    const [expand, setExpand] = useState<boolean>(false)
    const [user, setUser] = useState<User | null>(null)

    useEffect(() => {
        const theme = localStorage.getItem("theme");
        if (theme?.toLowerCase() == 'dark') {
            setTheme('Dark')
        } else {
            setTheme('Light')
        }
        const getUser = async () => {
            const { data: { user }, } = await supabase.auth.getUser();
            if (user == null) {router.push('/signin')}
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/${user?.id}`)
            const data = await res.json()
            setUser(data)
        }
        getUser();
    }, [])

    const logOut = async () => {
        await supabase.auth.signOut()
        router.push('/signin')
    }

    useEffect(() => {
        document.documentElement.classList.toggle("dark", theme == 'Dark' ? true : false);
    }, [theme])

    const changeTheme = () => {
        setTheme(theme == 'Dark' ? 'Light' : 'Dark')
        if (theme == 'Light') {
            console.log("Dark");
            localStorage.setItem('theme', 'Dark');
        } else {
            console.log("Light");
            localStorage.setItem('theme', 'Light');
        }
    }

    const expandSidebar = () => {
        setExpand(!expand)
    }

    return (
        <div className="flex flex-col text-foreground bg-background w-screen h-screen">
            {/* Header */}
            <div className="flex border-b gap-10 w-full min-h-12 h-[5%] justify-end items-center px-5 border-border">
                <button onClick={changeTheme} className="cursor-pointer">{theme == 'Dark' ? <Sun /> : <Moon />}</button>
                <button onClick={logOut} className="border cursor-pointer border-border w-10 h-10 rounded-full bg-accent">{(user?.username ?? '..').slice(0, 2)}</button>
            </div>
            {/* Main */}
            <div className="flex w-full flex-1 overflow-hidden">
                {/* Sidebar 1 */}
                <div className={`flex flex-col py-5 px-2 items-center place-content-between flex-1 min-w-15 ${expand ? 'max-w-[10%]' : 'max-w-[1%]'} border-r border-border`}>
                    <div className="flex flex-col gap-2 w-full h-full">
                        <div onClick={() => router.push('/chat')} className="flex w-full h-10 cursor-pointer items-center justify-center border rounded-md border-border">
                            {expand ? 'Chat' : 'C'}
                        </div>
                        <div onClick={() => router.push('/documents')} className="flex w-full h-10 cursor-pointer items-center justify-center border rounded-md border-border">
                            {expand ? 'Documents' : 'D'}
                        </div>
                    </div>
                    <div onClick={expandSidebar} className="flex w-full h-10 cursor-pointer items-center justify-center border rounded-md border-border">
                        {!expand && (<ChevronRight />)}
                        {expand && (<div className="flex place-content-between"><div><ChevronLeft /></div><span>Colapse</span></div>)}
                    </div>
                </div>
                <div className="flex flex-1">{children}</div>
            </div>
        </div>
    );
}
