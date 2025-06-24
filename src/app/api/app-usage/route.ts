import {NextResponse} from 'next/server';

export async function GET() {
  // In a real application, this data would come from a database or a tracking service.
  // For this demo, we provide static data to populate the chart.
  const appUsageData = [
    { app: "chrome", hours: 4.5 },
    { app: "vscode", hours: 3.2 },
    { app: "slack", hours: 1.8 },
    { app: "spotify", hours: 2.1 },
    { app: "other", hours: 1.4 },
  ];
  return NextResponse.json(appUsageData);
}
