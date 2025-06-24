import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { summarizeAppUsage, type SummarizeAppUsageInput } from "@/ai/flows/summarize-app-usage";
import { FileText } from "lucide-react";

export async function AiSummary({ appUsageData }: { appUsageData: SummarizeAppUsageInput }) {
  const { summary } = await summarizeAppUsage(appUsageData).catch(() => ({ summary: "Could not generate summary at this time." }));

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-4 space-y-0">
        <FileText className="h-6 w-6 text-primary" />
        <CardTitle className="font-headline">AI Usage Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{summary}</p>
      </CardContent>
    </Card>
  );
}
