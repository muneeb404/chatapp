import React, { useEffect, useRef } from 'react';
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import DateSeparator from "./DateSeparator";
import { formatMessageTime } from "../lib/utils";

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();
  const { authUser } = useAuthStore();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (selectedUser) {
      getMessages(selectedUser._id);
      subscribeToMessages();
    }
    return () => unsubscribeFromMessages();
  }, [selectedUser, getMessages, subscribeToMessages, unsubscribeFromMessages]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ block: "end", behavior: "auto" });
    }
  }, [messages]);

  if (!selectedUser) {
    return null;
  }

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col">
        <ChatHeader />
        <div className="flex-1 overflow-hidden">
          <MessageSkeleton />
        </div>
        <MessageInput />
      </div>
    );
  }

  const groupMessagesByDate = (messages) => {
    const groups = {};
    messages.forEach(message => {
      const date = new Date(message.createdAt).toLocaleDateString('en-US', { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
      });
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
    });
    return groups;
  };

  const groupedMessages = groupMessagesByDate(messages);

  return (
    <div className="flex-1 flex flex-col">
      <ChatHeader />
      <div className="flex-1 overflow-y-auto">
        <div className="min-h-full flex flex-col justify-end p-4 space-y-4">
          {Object.entries(groupedMessages).map(([date, dateMessages]) => (
            <React.Fragment key={date}>
              <DateSeparator date={date} />
              {dateMessages.map((message) => (
                <div
                  key={message._id}
                  className={`chat ${message.senderId === authUser._id ? "chat-end" : "chat-start"}`}
                >
                  <div className="chat-image avatar">
                    <div className="w-10 rounded-full">
                      <img
                        src={
                          message.senderId === authUser._id
                            ? authUser.profilePic || "/avatar.png"
                            : selectedUser.profilePic || "/avatar.png"
                        }
                        alt="profile pic"
                      />
                    </div>
                  </div>
                  <div className={`chat-bubble ${message.senderId === authUser._id ? "chat-bubble-primary" : "chat-bubble-neutral"}`}>
                    {message.image && (
                      <img
                        src={message.image}
                        alt="Attachment"
                        className="max-w-[200px] rounded-md mb-2"
                      />
                    )}
                    {message.text && <p>{message.text}</p>}
                  </div>
                  <div className="chat-footer opacity-50 mt-1 text-xs">
                    {formatMessageTime(message.createdAt)}
                  </div>
                </div>
              ))}
            </React.Fragment>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <MessageInput />
    </div>
  );
};

export default ChatContainer;

