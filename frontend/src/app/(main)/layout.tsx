'use client'

import { supabase } from "@/libs/supabase/supabase";
import { Sun, Moon, ChevronLeft, ChevronRight, MessageSquare, FileText } from "lucide-react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type User = {
    id: string
    username: string
    email: string
}

export default function Main({ children }: LayoutProps<"/">) {
    const router = useRouter()

    const { theme, setTheme } = useTheme()
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
            if (user == null) { router.push('/signin') }
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

    const expandSidebar = () => {
        setExpand(!expand)
    }

    return (
        <div className="flex flex-col text-foreground bg-[#fefefe] dark:bg-[#282828] w-screen h-screen">
            {/* Main */}
            <div className="flex w-full flex-1 overflow-hidden">
                {/* Sidebar 1 */}
                <div className={`flex flex-col py-5 px-2 items-center place-content-between flex-1 min-w-15 bg-[#ebecef] dark:bg-[#0f1b24] ${expand ? 'max-w-[13%]' : 'max-w-[1%]'} border-r border-[#dadce0] dark:border-[#454545]`}>
                    <div className="flex flex-col gap-2 w-full h-full">
                        <div onClick={() => router.push('/chat')} className="flex w-full h-10 cursor-pointer items-center justify-start rounded-md hover:bg-[#5558a1] hover:text-white dark:hover:bg-[#34345a] gap-3 px-3">
                            {expand && (<MessageSquare size={20} />)}{expand ? 'Chat' : <MessageSquare size={20} />}
                        </div>
                        <div onClick={() => router.push('/documents')} className="flex w-full h-10 cursor-pointer items-center justify-start rounded-md hover:bg-[#5558a1] hover:text-white dark:hover:bg-[#34345a] gap-3 px-3">
                            {expand && (<FileText size={20} />)}{expand ? 'Documents' : <FileText size={20} />}
                        </div>
                    </div>
                    <div onClick={() => setTheme(theme == 'dark' ? 'light' : 'dark')} className="flex w-full h-10 cursor-pointer items-center justify-start rounded-md hover:bg-[#5558a1] hover:text-white dark:hover:bg-[#34345a] gap-3 px-3">{theme == 'dark' ? <Sun size={20}/> : <Moon size={20}/>}{expand ? theme == 'dark' ? 'Dark' : 'Light' : ''}</div>
                    <div onClick={expandSidebar} className="flex w-full h-10 cursor-pointer items-center justify-start rounded-md hover:bg-[#5558a1] hover:text-white dark:hover:bg-[#34345a] gap-3 px-3">
                        {!expand && (<ChevronRight />)}
                        {expand && (<div className="flex place-content-between"><div><ChevronLeft /></div><span>Colapse</span></div>)}
                    </div>
                </div>
                <div className="flex flex-1">{children}</div>
            </div>
        </div>
    );
}
