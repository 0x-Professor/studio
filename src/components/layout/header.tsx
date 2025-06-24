import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bot } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center justify-between">
        <div className="flex items-center gap-4">
          <Bot className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold font-headline text-primary">MazharAI</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="font-semibold">Professor</p>
            <p className="text-xs text-muted-foreground">Welcome back</p>
          </div>
          <Avatar>
            <AvatarImage src="https://placehold.co/100x100.png" alt="Professor" data-ai-hint="man portrait" />
            <AvatarFallback>P</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
