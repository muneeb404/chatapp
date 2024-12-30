import React, { useState } from 'react'
// import { useEffect, useState } from "react";
// import { useChatStore } from "../store/useChatStore.js";
// import { useAuthStore } from "../store/useAuthStore.js";
// import SidebarSkeleton from "./skeletons/SidebarSkeleton.jsx";
import { Bot, Users } from "lucide-react";
import { useChatStore } from '../store/useChatStore';

function ChatbotSidebar() {
    // const { isBotClicked, setIsBotClicked } = useState(false);
    const { selectedBot, setSelectedBot } = useChatStore();
    // const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } = useChatStore();

    // const { onlineUsers } = useAuthStore();
    // const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  
    // useEffect(() => {
    //   getUsers();
    // }, [getUsers]);
  
    // const filteredUsers = showOnlineOnly
    //   ? users.filter((user) => onlineUsers.includes(user._id))
    //   : users;
  
    // if (isUsersLoading) return <SidebarSkeleton />;
  
    return (
      <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
        <div className="border-b border-base-300 w-full p-5">
          <div className="flex items-center gap-2">
            <Bot className="size-6" />
            <span className="font-medium hidden lg:block">MunaAI Assistant</span>
          </div>
          
          <div className="mt-3 hidden lg:flex items-center gap-2">
            <label className="cursor-pointer flex items-center gap-2">
              {/* <input
                type="checkbox"
                checked={showOnlineOnly}
                onChange={(e) => setShowOnlineOnly(e.target.checked)}
                className="checkbox checkbox-sm"
              /> */}
              <span className="text-sm">Empowering you with AI-driven solutions.</span>
            </label>
            {/* <span className="text-xs text-zinc-500">({onlineUsers.length - 1} online)</span> */}
          </div>
        </div>
  
        <div className="overflow-y-auto w-full py-3">
          {/* {filteredUsers.map((user) => ( */}
            <button
            //   key={user._id}
              onClick={() => setSelectedBot(true)}
              className={`
                w-full p-3 flex items-center gap-3
                hover:bg-base-300 transition-colors
                ${ selectedBot ? "bg-base-300 ring-1 ring-base-300" : ""}
                `}
            >
              <div className="relative mx-auto lg:mx-0">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-content font-medium">
                  <Bot className="w-full h-full p-1 text-primary-content" />
                    </div>
                {/* <img
                //   src={user.profilePic || "/avatar.png"}
                //   alt={user.name}
                src='/avatar.png'
                  className="size-12 object-cover rounded-full"
                /> */}
                {/* {onlineUsers.includes(user._id) && (
                  <span
                    className="absolute bottom-0 right-0 size-3 bg-green-500 
                    rounded-full ring-2 ring-zinc-900"
                  />
                )} */}
              </div>
  
              {/* User info - only visible on larger screens */}
              <div className="hidden lg:block text-left min-w-0">
                <div className="font-medium truncate">MunaAI</div>
                <div className="text-sm text-zinc-400">
                  {/* {onlineUsers.includes(user._id) ? "Online" : "Offline"} */}
                  Always here to assist you.
                </div>
              </div>
            </button>
          {/* ))} */}
  
          {/* {filteredUsers.length === 0 && (
            <div className="text-center text-zinc-500 py-4">No online users</div>
          )} */}
        </div>
      </aside>
    );
}

export default ChatbotSidebar