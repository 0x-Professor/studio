import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { suggestBreakSchedule, type SuggestBreakScheduleInput } from "@/ai/flows/suggest-break-schedule";
import { Coffee } from "lucide-react";
import { isAiEnabled } from "@/ai/genkit";

export async function BreakSchedule({ scheduleInfo }: { scheduleInfo: SuggestBreakScheduleInput }) {
  let breakSchedule = "Please set your GOOGLE_API_KEY in the .env file to enable AI features.";

  if (isAiEnabled()) {
    try {
      const result = await suggestBreakSchedule(scheduleInfo);
      breakSchedule = result.breakSchedule;
    } catch (e) {
      console.error(e);
      breakSchedule = "Remember to take a 5-minute break every hour to stretch and rest your eyes.";
    }
  }

  return (
    <Card className="glassmorphic">
      <CardHeader className="flex flex-row items-center gap-4 space-y-0">
        <Coffee className="h-6 w-6 text-primary text-glow" />
        <CardTitle className="font-headline">Suggested Break</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{breakSchedule}</p>
      </CardContent>
    </Card>
  );
}
