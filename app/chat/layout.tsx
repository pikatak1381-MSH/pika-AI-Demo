// app/chat/layout.tsx
"use client"

import Sidebar from "@/components/chatpage/sidebar/Sidebar"
import ChatHeader from "@/components/chatpage/chatsection/ChatHeader"

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full flex h-screen overflow-hidden bg-[#f9f9f9]">
        <Sidebar />
        
        <div className="w-full relative flex flex-col items-center h-screen">
            <ChatHeader />
            {children}
        </div>
    </div>
  )
}
