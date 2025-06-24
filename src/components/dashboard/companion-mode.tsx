"use client";

import { useState, useTransition, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { getAffirmationWithAudio } from "@/app/actions";
import { Heart, Mic, Send, Bot, User } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

type Message = {
  role: "user" | "assistant";
  content: string;
};

// SpeechRecognition might not exist on the window object, so we declare it
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export function CompanionMode() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello, Professor. How may I assist you today? You can ask me to add tasks to your to-do list.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isPending, startTransition] = useTransition();
  const [isListening, setIsListening] = useState(false);
  
  const recognitionRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.lang = 'en-US';
      recognition.interimResults = false;

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        handleSubmit(transcript); // auto-submit after speech
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
      };
      
      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);
  
  useEffect(() => {
    // Scroll to bottom when new messages are added
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  }, [messages]);


  const handleListen = () => {
    if (recognitionRef.current) {
      if (isListening) {
        recognitionRef.current.stop();
        setIsListening(false);
      } else {
        recognitionRef.current.start();
        setIsListening(true);
      }
    } else {
      alert("Speech recognition is not supported in this browser.");
    }
  };

  const handleSubmit = (text: string) => {
    const currentInput = text.trim();
    if (currentInput === "") return;

    setMessages((prev) => [...prev, { role: "user", content: currentInput }]);
    setInput("");

    startTransition(async () => {
      const result = await getAffirmationWithAudio({ userInput: currentInput });
      setMessages((prev) => [...prev, { role: "assistant", content: result.affirmation }]);
      
      if (result.audioDataUri && audioRef.current) {
        audioRef.current.src = result.audioDataUri;
        audioRef.current.play().catch(e => console.error("Error playing audio:", e));
      }
    });
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-row items-center gap-4 space-y-0">
        <Heart className="h-6 w-6 text-primary" />
        <CardTitle className="font-headline">Companion</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col flex-grow gap-4 h-full">
        <ScrollArea className="flex-grow h-64 pr-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={cn(
                  "flex items-start gap-3",
                  message.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                {message.role === "assistant" && (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback><Bot className="h-5 w-5"/></AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={cn(
                    "max-w-xs md:max-w-md lg:max-w-lg rounded-lg p-3 text-sm",
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  )}
                >
                  <p>{message.content}</p>
                </div>
                 {message.role === "user" && (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>P</AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
             {isPending && (
              <div className="flex items-start gap-3 justify-start">
                <Avatar className="h-8 w-8">
                  <AvatarFallback><Bot className="h-5 w-5"/></AvatarFallback>
                </Avatar>
                <div className="bg-muted rounded-lg p-3 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-foreground animate-pulse delay-0"></span>
                    <span className="h-2 w-2 rounded-full bg-foreground animate-pulse delay-150"></span>
                    <span className="h-2 w-2 rounded-full bg-foreground animate-pulse delay-300"></span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(input);
          }}
          className="flex gap-2"
        >
          <Textarea
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={1}
            className="flex-grow resize-none"
            disabled={isPending || isListening}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(input);
              }
            }}
          />
          <Button type="button" size="icon" onClick={handleListen} variant={isListening ? "destructive" : "outline"} disabled={isPending}>
            <Mic className="h-4 w-4" />
          </Button>
          <Button type="submit" size="icon" disabled={isPending || input.trim() === ""}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
        <audio ref={audioRef} className="hidden" />
      </CardContent>
    </Card>
  );
}
