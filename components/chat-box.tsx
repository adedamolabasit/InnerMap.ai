"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Send } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ChatBoxProps {
  messages: Array<{
    id: number
    text: string
    sender: "user" | "other"
  }>
  onSendMessage: (text: string) => void
}

export default function ChatBox({ messages, onSendMessage }: ChatBoxProps) {
  const [input, setInput] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = () => {
    onSendMessage(input)
    setInput("")
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="space-y-4">
      {/* Messages Container */}
      <div className="bg-card/50 rounded-lg border border-border p-4 h-64 overflow-y-auto space-y-3">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-xs px-4 py-2 rounded-lg ${
                msg.sender === "user" ? "bg-accent text-accent-foreground" : "bg-muted text-foreground"
              }`}
            >
              <p className="text-sm">{msg.text}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Share a thought..."
          className="flex-1 bg-input border border-border rounded-lg px-4 py-2 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
        />
        <Button
          onClick={handleSend}
          disabled={!input.trim()}
          size="sm"
          className="bg-accent hover:bg-accent/90 text-accent-foreground"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
