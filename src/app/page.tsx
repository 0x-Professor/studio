import { Header } from "@/components/layout/header";
import { AppUsageChart } from "@/components/dashboard/app-usage-chart";
import { AiSummary } from "@/components/dashboard/ai-summary";
import { TaskManager } from "@/components/dashboard/task-manager";
import { ProductivityTips } from "@/components/dashboard/productivity-tips";
import { BreakSchedule } from "@/components/dashboard/break-schedule";
import { CompanionMode } from "@/components/dashboard/companion-mode";
import { getUserActivities, getTasks, isAiEnabled } from "@/ai/genkit";

export default async function Home() {
  let activitySummary = "AI features are disabled. Please provide an API key.";
  let taskHistorySummary = "No task history available.";

  if (isAiEnabled()) {
    const activities = getUserActivities();
    const tasks = getTasks();
    const completedTasks = tasks.filter(t => t.completed).length;
    const pendingTasks = tasks.length - completedTasks;

    activitySummary = activities.length > 0
      ? `Recent activities include: ${activities.slice(0, 3).map(a => a.activity).join(', ')}.`
      : "No recent activity logged.";
      
    taskHistorySummary = `Completed ${completedTasks} tasks, ${pendingTasks} pending.`;
  }
  
  const summaryInput = {
    appUsageData: activitySummary,
  };

  const userInfoForAI = {
    userName: "Professor",
    appUsageSummary: activitySummary,
    taskHistory: taskHistorySummary,
  };

  const scheduleInfoForAI = {
    appUsageSummary: activitySummary,
    userGoals: "Stay productive, Professor.",
  };


  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 p-4 md:p-6 lg:p-4">
        <div className="container max-w-screen-2xl mx-auto grid grid-cols-1 lg:grid-cols-3 auto-rows-max gap-4 lg:gap-6">
          <div className="lg:col-span-2">
            <AppUsageChart />
          </div>
          <div className="lg:col-span-1">
            <AiSummary appUsageData={summaryInput} />
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
            <CompanionMode />
          </div>
        </div>
      </main>
    </div>
  );
}
