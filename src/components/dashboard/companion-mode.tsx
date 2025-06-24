"use client";

import { useState, useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { getAffirmation } from "@/app/actions";
import { Heart } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export function CompanionMode({ initialAffirmation }: { initialAffirmation: string }) {
  const [affirmation, setAffirmation] = useState(initialAffirmation);
  const [isPending, startTransition] = useTransition();

  const handleMoodChange = (newMood: string) => {
    startTransition(async () => {
      const newAffirmation = await getAffirmation({ mood: newMood });
      setAffirmation(newAffirmation);
    });
  };

  const moods = [
    { value: "productive", label: "Productive", emoji: "🚀" },
    { value: "stressed", label: "Stressed", emoji: "😥" },
    { value: "happy", label: "Happy", emoji: "😊" },
    { value: "tired", label: "Tired", emoji: "😴" },
  ];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-4 space-y-0">
        <Heart className="h-6 w-6 text-primary" />
        <CardTitle className="font-headline">Companion</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label className="text-sm font-medium">How are you feeling?</Label>
          <RadioGroup
            defaultValue="productive"
            className="flex flex-wrap gap-4 pt-2"
            onValueChange={handleMoodChange}
            disabled={isPending}
          >
            {moods.map(({ value, label, emoji }) => (
              <div key={value} className="flex items-center space-x-2">
                <RadioGroupItem value={value} id={value} />
                <Label htmlFor={value} className="flex items-center gap-2 cursor-pointer">
                  <span>{emoji}</span>
                  {label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
        <div className="p-4 bg-muted/50 rounded-lg min-h-[6rem] flex items-center justify-center text-center transition-colors">
          {isPending ? (
            <div className="space-y-2 w-full">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4 mx-auto" />
            </div>
          ) : (
            <p className="text-muted-foreground italic">"{affirmation}"</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
