import { Header } from "@/components/layout/header";
import { AppUsageChart } from "@/components/dashboard/app-usage-chart";
import { AiSummary } from "@/components/dashboard/ai-summary";
import { TaskManager } from "@/components/dashboard/task-manager";
import { ProductivityTips } from "@/components/dashboard/productivity-tips";
import { BreakSchedule } from "@/components/dashboard/break-schedule";
import { CompanionMode } from "@/components/dashboard/companion-mode";
import type { AppUsage } from "@/types";
import { motivationalAffirmations } from "@/ai/flows/motivational-affirmations";

const appUsageData: AppUsage[] = [
  { app: "chrome", hours: 4.5 },
  { app: "vscode", hours: 3.2 },
  { app: "slack", hours: 1.8 },
  { app: "spotify", hours: 2.1 },
  { app: "other", hours: 1.4 },
];

const appUsageForAI = {
  appUsageData: JSON.stringify(appUsageData.map(d => ({ application: d.app, durationHours: d.hours }))),
};

const userInfoForAI = {
  userName: "Muhammad Mazhar Saeed",
  appUsageSummary: "High usage of development and communication tools.",
  taskHistory: "Completed 2 tasks, 3 pending.",
};

const scheduleInfoForAI = {
  appUsageSummary: "High usage of development and communication tools, suggesting long periods of focused work.",
  userGoals: "Stay productive, improve time management.",
};


export default async function Home() {
  const { affirmation: initialAffirmation } = await motivationalAffirmations({ mood: "productive" });

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 p-4 sm:p-6 md:p-8">
        <div className="container max-w-screen-2xl mx-auto grid grid-cols-1 lg:grid-cols-3 auto-rows-max gap-6">
          <div className="lg:col-span-2">
            <AppUsageChart data={appUsageData} />
          </div>
          <div className="lg:col-span-1">
            <AiSummary appUsageData={appUsageForAI} />
          </div>
          <div className="lg:col-span-1 lg:row-span-2">
            <TaskManager />
          </div>
          <div className="lg:col-span-1">
            <ProductivityTips userInfo={userInfoForAI} />
          </div>
          <div className="lg:col-span-1">
            <BreakSchedule scheduleInfo={scheduleInfoForAI} />
          </div>
          <div className="lg:col-span-2">
            <CompanionMode initialAffirmation={initialAffirmation} />
          </div>
        </div>
      </main>
    </div>
  );
}
