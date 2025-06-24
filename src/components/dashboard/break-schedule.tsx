import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { suggestBreakSchedule, type SuggestBreakScheduleInput } from "@/ai/flows/suggest-break-schedule";
import { Coffee } from "lucide-react";

export async function BreakSchedule({ scheduleInfo }: { scheduleInfo: SuggestBreakScheduleInput }) {
  const { breakSchedule } = await suggestBreakSchedule(scheduleInfo).catch(() => ({ breakSchedule: "Remember to take a 5-minute break every hour to stretch and rest your eyes." }));

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-4 space-y-0">
        <Coffee className="h-6 w-6 text-primary" />
        <CardTitle className="font-headline">Suggested Break</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{breakSchedule}</p>
      </CardContent>
    </Card>
  );
}
