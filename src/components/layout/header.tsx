import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Cpu } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-lg">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between">
        <div className="flex items-center gap-4">
          <Cpu className="h-8 w-8 text-primary text-glow" />
          <h1 className="text-2xl font-bold font-headline text-primary text-glow">MazharAI</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="font-semibold font-headline">Professor</p>
            <p className="text-xs text-muted-foreground">Welcome back</p>
          </div>
          <Avatar className="border-2 border-primary/50">
            <AvatarImage src="https://placehold.co/100x100.png" alt="Professor" data-ai-hint="man portrait" />
            <AvatarFallback>P</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
