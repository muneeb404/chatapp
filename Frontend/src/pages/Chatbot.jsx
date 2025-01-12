import React, { useEffect } from "react";
import ChatbotSidebar from "../components/ChatbotSidebar";
import { useChatStore } from "../store/useChatStore";
import ChatbotContainer from "../components/ChatbotContainer";
import NoChatBotSelected from "../components/NoChatBotSelected";

function Chatbot() {
  const { selectedBot, setSelectedBot } = useChatStore();

  useEffect(() => {
    // Automatically select the bot on mobile
    const isMobile = window.innerWidth < 1024; // Assuming 1024px is the breakpoint for lg
    if (isMobile) {
      setSelectedBot(true);
    }
  }, [setSelectedBot]);

  return (
    <div className="h-screen bg-base-200">
      <div className="flex items-center justify-center pt-20 px-4">
        <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-8rem)]">
          <div className="flex h-full rounded-lg overflow-hidden">
            <div className="hidden lg:block">
              <ChatbotSidebar />
            </div>
            {!selectedBot ? <NoChatBotSelected /> : <ChatbotContainer />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chatbot;

