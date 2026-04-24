import React, { useState, useRef, useEffect } from "react";
import { Send, User, Bot, Sparkles, Loader2 } from "lucide-react";
import { Message } from "../types";
import { motion, AnimatePresence } from "motion/react";

interface ChatPanelProps {
  messages: Message[];
  onSendMessage: (content: string) => void;
  isTyping: boolean;
}

export function ChatPanel({ messages, onSendMessage, isTyping }: ChatPanelProps) {
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;
    onSendMessage(input.trim());
    setInput("");
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#f8f8f8]">
      <div className="p-4 border-b border-black bg-white flex items-center justify-between">
        <h2 className="text-xl font-bold uppercase tracking-tight flex items-center gap-2">
          <Bot className="h-5 w-5 text-[#E32E26]" />
          AI Travel Assistant
        </h2>
        <div className="flex items-center gap-2 text-[10px] uppercase font-bold text-[#888]">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          Connected
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <AnimatePresence initial={false}>
          {messages.length === 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center h-full text-center space-y-4"
            >
              <div className="w-16 h-16 bg-white border border-black flex items-center justify-center">
                <Sparkles className="h-8 w-8 text-[#E32E26]" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Your Personal AI Concierge</h3>
                <p className="text-sm text-[#555] max-w-xs">
                  Fill in the trip details on the left, or just tell me where you want to go.
                </p>
              </div>
            </motion.div>
          )}

          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: msg.role === "user" ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`flex gap-4 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
            >
              <div className={`w-8 h-8 shrink-0 flex items-center justify-center border border-black ${
                msg.role === "user" ? "bg-black text-white" : "bg-white text-black"
              }`}>
                {msg.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
              </div>
              <div className={`max-w-[80%] rounded-sm p-4 relative border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${
                msg.role === "user" ? "bg-[#E32E26] text-white border-[#E32E26]" : "bg-white text-black"
              }`}>
                <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                <span className={`text-[10px] mt-2 block opacity-50 ${msg.role === "user" ? "text-white text-right" : "text-black"}`}>
                  {msg.timestamp}
                </span>
              </div>
            </motion.div>
          ))}

          {isTyping && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex gap-4"
            >
              <div className="w-16 h-16 flex items-center justify-center bg-white border border-black">
                <Loader2 className="h-4 w-4 animate-spin text-[#E32E26]" />
              </div>
              <div className="bg-white border border-black p-4 rounded-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center gap-2 italic text-sm text-[#888]">
                AI is thinking...
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={endRef} />
      </div>

      <div className="p-4 bg-white border-t border-black">
        <form onSubmit={handleSubmit} className="flex gap-2 p-1 border border-black focus-within:ring-2 focus-within:ring-[#E32E26] transition-all">
          <input
            type="text"
            className="flex-1 bg-transparent border-none outline-none px-4 py-2 text-sm"
            placeholder="Type your question or refinement..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button 
            type="submit"
            disabled={!input.trim() || isTyping}
            className={`p-2 bg-black text-white hover:bg-[#E32E26] transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
