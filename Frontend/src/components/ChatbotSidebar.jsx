import React from 'react'
import { Bot } from 'lucide-react'
import { useChatStore } from '../store/useChatStore'

function ChatbotSidebar() {
    const { selectedBot, setSelectedBot } = useChatStore()

    return (
        <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200 bg-base-100">
            <div className="border-b border-base-300 w-full p-4 lg:p-5">
                <div className="flex items-center gap-3">
                    <Bot className="w-8 h-8" />
                    <span className="font-medium text-lg hidden lg:block">MunaAI Assistant</span>
                </div>
                
                <div className="mt-3 hidden lg:block">
                    <p className="text-sm text-base-content/70">
                        Empowering you with AI-driven solutions.
                    </p>
                </div>
            </div>
    
            <div className="overflow-y-auto flex-grow w-full py-4">
                <button
                    onClick={() => setSelectedBot(true)}
                    className={`
                        w-full p-3 flex items-center gap-3
                        hover:bg-base-200 transition-colors
                        ${selectedBot ? "bg-base-200" : ""}
                    `}
                >
                    <div className="relative mx-auto lg:mx-0">
                        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-content">
                            <Bot className="w-6 h-6" />
                        </div>
                    </div>
    
                    <div className="hidden lg:block text-left min-w-0">
                        <div className="font-medium truncate">MunaAI</div>
                        <div className="text-sm text-base-content/70">
                            Always here to assist you.
                        </div>
                    </div>
                </button>
            </div>

            <div className="border-t border-base-300 p-4 hidden lg:block">
                <p className="text-xs text-base-content/50 text-center">
                    © 2023 MunaAI. All rights reserved.
                </p>
            </div>
        </aside>
    )
}

export default ChatbotSidebar

