import { Bot, Send, X, Loader, Trash2, Copy } from 'lucide-react';
import React, { useState, useRef, useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import axios from "axios";
import { useAuthStore } from "../store/useAuthStore";
import { formatBotResponse } from '../lib/formatBotResponse';

const MAX_STORED_MESSAGES = 20;

function ChatbotContainer() {
  const { setSelectedBot } = useChatStore();
  const { authUser } = useAuthStore();
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const storedMessages = JSON.parse(localStorage.getItem('chatMessages') || '[]');
    setMessages(storedMessages);
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      const messagesToStore = messages.slice(-MAX_STORED_MESSAGES);
      localStorage.setItem('chatMessages', JSON.stringify(messagesToStore));
    }
    scrollToBottom();
  }, [messages]);

  async function generateAnswers() {
    if (!question.trim() || loading) return;

    const newMessage = { type: "question", text: question };
    setMessages((prev) => [...prev, newMessage]);

    setLoading(true);
    try {
      const response = await axios.post(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyAqc4Ujw0ShF751NPwEzR4M_pnL-QTgkBc",
        {
          contents: [
            {
              parts: [{ text: question }],
            },
          ],
        }
      );

      const answerText =
        response?.data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response.";
      const newAnswer = { type: "answer", text: answerText };
      setMessages((prev) => [...prev, newAnswer]);
    } catch (error) {
      const errorMessage = { type: "answer", text: "Error fetching response. Please try again." };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }

    setQuestion("");
  }

  const clearChat = () => {
    setMessages([]);
    localStorage.removeItem('chatMessages');
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      console.log("Copied to clipboard");
    });
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-base-200 rounded-lg shadow-lg">
      {/* Chat Header */}
      <div className="p-4 border-b border-base-300 bg-base-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="avatar">
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-content">
                <Bot className="w-full h-full p-1" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold">MunaAI</h3>
              <p className="text-sm text-base-content/70">Always here to assist you.</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={clearChat}
              aria-label="Clear Chat"
              className="btn btn-ghost btn-circle"
            >
              <Trash2 size={20} />
            </button>
            <button
              onClick={() => setSelectedBot(null)}
              aria-label="Close Chat"
              className="btn btn-ghost btn-circle"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Messages Section */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex items-start gap-2 ${
              message.type === "question" ? "justify-end" : "justify-start"
            }`}
          >
            {message.type === "answer" && (
              <div className="avatar">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                  <Bot className="w-full h-full p-1 text-primary-content" />
                </div>
              </div>
            )}

            <div
              className={`chat-bubble flex items-start p-3 max-w-[70%] ${
                message.type === "question"
                  ? "chat-bubble-primary text-right"
                  : "chat-bubble-neutral text-left"
              }`}
            >
              {message.type === "question" ? (
                <p>{message.text}</p>
              ) : (
                <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: formatBotResponse(message.text) }} />
              )}
              <button
                onClick={() => copyToClipboard(message.text)}
                className="btn btn-xs btn-ghost"
                aria-label="Copy message"
              >
                <Copy size={12} />
              </button>
            </div>

            {message.type === "question" && (
              <div className="avatar">
                <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
                  <img
                    src={authUser?.profilePic || "/avatar.png"}
                    alt="User Avatar"
                    className="w-full h-full rounded-full"
                  />
                </div>
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Section */}
      <div className="p-4 bg-base-100 border-t border-base-300">
        <form
          className="flex items-center gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            generateAnswers();
          }}
        >
          <div className="flex-1 relative">
            <input
              type="text"
              className="w-full input input-bordered rounded-full pr-16"
              placeholder="Type a question..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              disabled={loading}
              aria-label="Type a question"
            />
            <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-sm text-base-content/50">
              {question.length}/1000
            </span>
          </div>
          <button
            type="submit"
            className={`btn btn-circle btn-primary ${loading ? 'loading' : ''}`}
            disabled={loading}
            aria-label="Send"
          >
            {loading ? <Loader className="animate-spin" /> : <Send size={18} />}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ChatbotContainer;

