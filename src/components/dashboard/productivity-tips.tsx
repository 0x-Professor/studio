import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { proactiveProductivityTips, type ProactiveProductivityTipsInput } from "@/ai/flows/proactive-productivity-tips";
import { Lightbulb } from "lucide-react";
import { isAiEnabled } from "@/ai/genkit";

export async function ProductivityTips({ userInfo }: { userInfo: ProactiveProductivityTipsInput }) {
  let productivityTips = ["Please set your GOOGLE_API_KEY in the .env file to enable AI features."];

  if (isAiEnabled()) {
    try {
      const result = await proactiveProductivityTips(userInfo);
      productivityTips = result.productivityTips;
    } catch(e) {
      console.error(e);
      productivityTips = ["Take regular breaks to stay fresh."];
    }
  }

  return (
    <Card className="glassmorphic">
      <CardHeader className="flex flex-row items-center gap-4 space-y-0">
        <Lightbulb className="h-6 w-6 text-primary text-glow" />
        <CardTitle className="font-headline">Proactive Tips</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2 text-muted-foreground list-disc pl-5">
          {productivityTips.map((tip, index) => (
            <li key={index}>{tip}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
