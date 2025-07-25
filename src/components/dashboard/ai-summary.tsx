import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { summarizeAppUsage, type SummarizeAppUsageInput } from "@/ai/flows/summarize-app-usage";
import { FileText } from "lucide-react";
import { isAiEnabled } from "@/ai/genkit";

export async function AiSummary({ appUsageData }: { appUsageData: SummarizeAppUsageInput }) {
  let summary = "Please set your GOOGLE_API_KEY in the .env file to enable AI features.";
  
  if (isAiEnabled()) {
    try {
      const result = await summarizeAppUsage(appUsageData);
      summary = result.summary;
    } catch (e) {
      console.error(e);
      summary = "Could not generate summary at this time.";
    }
  }

  return (
    <Card className="glassmorphic">
      <CardHeader className="flex flex-row items-center gap-4 space-y-0">
        <FileText className="h-6 w-6 text-primary text-glow" />
        <CardTitle className="font-headline">AI Usage Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{summary}</p>
      </CardContent>
    </Card>
  );
}
