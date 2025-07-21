"use client";

import { useState, useEffect, useRef, useTransition } from "react";
import type { Post, ChatMessage } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Sparkles, Loader2, Bot } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { suggestEmojiAction, SummarizeChatSuggestStepsInput, summarizeChatSuggestSteps } from "@/ai/flows";

export function ChatView({ post }: { post: Post }) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      text: `Hi, I am interested in booking your asset: "${post.title}".`,
      sender: "user",
      timestamp: Date.now() - 10000,
    },
    {
      id: "2",
      text: "Hello! The asset is available. How can I help?",
      sender: "owner",
      timestamp: Date.now() - 5000,
    },
  ]);
  const [input, setInput] = useState("");
  const [suggestedEmojis, setSuggestedEmojis] = useState<string[]>([]);
  const [isSuggesting, startSuggestionTransition] = useTransition();
  const [summary, setSummary] = useState<{ summary: string, suggestedNextSteps: string } | null>(null);
  const [isSummarizing, startSummaryTransition] = useTransition();

  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
      if (viewport) {
        viewport.scrollTop = viewport.scrollHeight;
      }
    }
  }, [messages]);
  
  useEffect(() => {
    if (input.trim().length > 2) {
      const timer = setTimeout(() => {
        startSuggestionTransition(async () => {
          const result = await suggestEmojiAction({ message: input });
          setSuggestedEmojis(result.emojis || []);
        });
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setSuggestedEmojis([]);
    }
  }, [input]);

  const handleSendMessage = () => {
    if (input.trim() === "") return;
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
      timestamp: Date.now(),
    };
    setMessages(prev => [...prev, newMessage]);
    setInput("");
    setSuggestedEmojis([]);

    // Simulate owner reply
    setTimeout(() => {
        const reply: ChatMessage = {
            id: (Date.now() + 1).toString(),
            text: "That's a great question. Let me check on that for you.",
            sender: 'owner',
            timestamp: Date.now() + 1
        };
        setMessages(prev => [...prev, reply]);
    }, 1500)
  };
  
  const handleSummarize = () => {
    startSummaryTransition(async () => {
        const chatHistory = messages.map(m => `${m.sender}: ${m.text}`).join('\n');
        const input: SummarizeChatSuggestStepsInput = { chatHistory };
        const result = await summarizeChatSuggestSteps(input);
        setSummary(result);
    });
  }

  return (
    <div className="flex flex-col h-[calc(100vh-57px)]">
      <header className="flex items-center gap-4 p-3 border-b shrink-0">
        <Avatar>
          <AvatarImage src={`https://placehold.co/40x40?text=${post.ownerAvatar}`} alt={post.owner} />
          <AvatarFallback>{post.ownerAvatar}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <p className="font-bold font-headline">{post.owner}</p>
          <p className="text-sm text-muted-foreground">Owner of: {post.title}</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" onClick={handleSummarize}>
                <Sparkles className="mr-2 h-4 w-4" />
                AI Summary
            </Button>
          </DialogTrigger>
          <DialogContent>
             <DialogHeader>
                <DialogTitle className="flex items-center gap-2 font-headline text-2xl"><Bot /> AI Chat Analysis</DialogTitle>
                <DialogDescription>
                    Here's a summary of your conversation and suggested next steps.
                </DialogDescription>
             </DialogHeader>
             {isSummarizing ? (
                <div className="space-y-4 py-4">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-4 w-1/3 mt-4" />
                    <Skeleton className="h-24 w-full" />
                </div>
             ) : summary ? (
                <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
                    <div>
                        <h3 className="font-semibold mb-2 font-headline">Summary</h3>
                        <p className="text-sm text-muted-foreground">{summary.summary}</p>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-2 font-headline">Suggested Next Steps</h3>
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">{summary.suggestedNextSteps}</p>
                    </div>
                </div>
             ) : (
                <p>No summary available.</p>
             )}
          </DialogContent>
        </Dialog>
      </header>
      <ScrollArea className="flex-1" ref={scrollAreaRef}>
        <div className="p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex items-end gap-2",
                message.sender === "user" ? "justify-end" : "justify-start"
              )}
            >
              {message.sender === "owner" && (
                <Avatar className="h-8 w-8">
                  <AvatarImage src={`https://placehold.co/40x40?text=${post.ownerAvatar}`} alt={post.owner} />
                  <AvatarFallback>{post.ownerAvatar}</AvatarFallback>
                </Avatar>
              )}
              <div
                className={cn(
                  "max-w-xs md:max-w-md lg:max-w-lg rounded-lg px-4 py-2",
                  message.sender === "user"
                    ? "bg-accent text-accent-foreground"
                    : "bg-secondary"
                )}
              >
                <p>{message.text}</p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
      <footer className="p-4 border-t shrink-0 bg-background">
        <div className="grid gap-2">
          <Textarea
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            className="text-base"
          />
           <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                 {isSuggesting && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
                 {suggestedEmojis.map((emoji) => (
                    <Button
                        key={emoji}
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 text-xl"
                        onClick={() => setInput(prev => prev + emoji)}
                    >
                        {emoji}
                    </Button>
                 ))}
              </div>
              <Button onClick={handleSendMessage} disabled={!input.trim()}>
                <Send className="mr-2 h-4 w-4" /> Send
              </Button>
           </div>
        </div>
      </footer>
    </div>
  );
}
