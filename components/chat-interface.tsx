"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Loader2, Bot, User } from "lucide-react";
import { sendChatMessage } from "@/actions/chat";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "안녕하세요! 보조기기 지원사업과 제품에 대해 궁금한 점을 물어보세요. 정확하고 최신 정보를 제공해드리겠습니다.",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await sendChatMessage(userMessage.content);
      
      // 응답 검증
      if (!response || !response.message || response.message.trim().length === 0) {
        throw new Error("AI가 응답을 생성하지 못했습니다.");
      }
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response.message.trim(),
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      
      // 에러 메시지 추출
      let errorMessageText = "죄송합니다. 답변을 생성하는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
      
      if (error instanceof Error && error.message) {
        // 사용자 친화적인 에러 메시지가 있으면 사용
        if (error.message.includes("문의") || error.message.includes("시도") || error.message.includes("오류")) {
          errorMessageText = error.message;
        }
      }
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: errorMessageText,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  return (
    <div 
      className="flex flex-col h-[calc(100vh-300px)] min-h-[600px] bg-white/5 border border-white/10 rounded-2xl overflow-hidden"
      role="region"
      aria-label="AI 챗봇 대화 영역"
    >
      {/* 메시지 영역 */}
      <div 
        className="flex-1 overflow-y-auto p-6 space-y-4"
        role="log"
        aria-live="polite"
        aria-atomic="false"
        aria-label="채팅 메시지 목록"
      >
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-4 ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
            role={message.role === "user" ? "user-message" : "assistant-message"}
          >
            {message.role === "assistant" && (
              <div 
                className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0"
                aria-label="AI 챗봇"
              >
                <Bot className="w-5 h-5 text-blue-400" aria-hidden="true" />
              </div>
            )}
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                message.role === "user"
                  ? "bg-blue-500/20 text-white"
                  : "bg-white/5 text-gray-200"
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              <p className="text-xs text-gray-500 mt-2" aria-label={`메시지 전송 시간: ${message.timestamp.toLocaleTimeString("ko-KR", {
                hour: "2-digit",
                minute: "2-digit",
              })}`}>
                {message.timestamp.toLocaleTimeString("ko-KR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
            {message.role === "user" && (
              <div 
                className="w-8 h-8 rounded-full bg-gray-500/20 flex items-center justify-center flex-shrink-0"
                aria-label="사용자"
              >
                <User className="w-5 h-5 text-gray-400" aria-hidden="true" />
              </div>
            )}
          </div>
        ))}
        
        {isLoading && (
          <div className="flex gap-4 justify-start" aria-live="polite" aria-label="답변 생성 중">
            <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
              <Bot className="w-5 h-5 text-blue-400" aria-hidden="true" />
            </div>
            <div className="bg-white/5 rounded-2xl px-4 py-3">
              <Loader2 className="w-5 h-5 text-blue-400 animate-spin" aria-label="로딩 중" />
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} aria-hidden="true" />
      </div>

      {/* 입력 영역 */}
      <form 
        onSubmit={handleSubmit} 
        className="p-4 border-t border-white/10"
        aria-label="메시지 입력 폼"
      >
        <div className="flex gap-2">
          <label htmlFor="chat-input" className="sr-only">
            보조기기 지원사업이나 제품에 대해 질문하기
          </label>
          <Input
            id="chat-input"
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="보조기기 지원사업이나 제품에 대해 질문해보세요..."
            className="flex-1 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-blue-500/50 focus-visible:ring-2 focus-visible:ring-blue-500/50"
            disabled={isLoading}
            aria-label="채팅 메시지 입력"
            aria-describedby="chat-input-hint"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />
          <Button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="bg-blue-500 hover:bg-blue-600 text-white rounded-full px-6 focus-visible:ring-2 focus-visible:ring-blue-500/50"
            aria-label={isLoading ? "메시지 전송 중" : "메시지 전송"}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
                <span className="sr-only">전송 중</span>
              </>
            ) : (
              <>
                <Send className="w-5 h-5" aria-hidden="true" />
                <span className="sr-only">전송</span>
              </>
            )}
          </Button>
        </div>
        <p id="chat-input-hint" className="text-xs text-gray-500 mt-2 text-center">
          최신 지원사업 정보와 제품 정보를 제공합니다
        </p>
      </form>
    </div>
  );
}

