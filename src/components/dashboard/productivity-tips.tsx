import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { proactiveProductivityTips, type ProactiveProductivityTipsInput } from "@/ai/flows/proactive-productivity-tips";
import { Lightbulb } from "lucide-react";

export async function ProductivityTips({ userInfo }: { userInfo: ProactiveProductivityTipsInput }) {
  const { productivityTips } = await proactiveProductivityTips(userInfo).catch(() => ({ productivityTips: ["Take regular breaks to stay fresh."] }));

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-4 space-y-0">
        <Lightbulb className="h-6 w-6 text-primary" />
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
