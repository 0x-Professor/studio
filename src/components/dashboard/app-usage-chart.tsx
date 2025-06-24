"use client";

import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Cell } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";

interface AppUsageChartProps {
}

const chartConfig = {
  hours: {
    label: "Hours",
  },
  chrome: {
    label: "Chrome",
    color: "hsl(var(--chart-1))",
  },
  vscode: {
    label: "VS Code",
    color: "hsl(var(--chart-2))",
  },
  slack: {
    label: "Slack",
    color: "hsl(var(--chart-3))",
  },
  spotify: {
    label: "Spotify",
    color: "hsl(var(--chart-4))",
  },
  other: {
    label: "Other",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig;

export function AppUsageChart({ data }: AppUsageChartProps) {
  const [appUsageData, setAppUsageData] = useState<any[]>([]);

  useEffect(() => {
    // In a real application, you would fetch this data from an API endpoint
    // For this example, we'll simulate fetching data after a delay
    const fetchData = async () => {
      // Replace with actual data fetching logic
      const response = await fetch("/api/app-usage"); // Example API endpoint
      const data = await response.json();
      setAppUsageData(data);
    };
    fetchData();
  }, []);

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="font-headline">App Usage Today</CardTitle>
        <CardDescription>Your most used applications today.</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer config={chartConfig} className="w-full h-full min-h-[300px]">
          <ResponsiveContainer width="100%" height="100%" data={appUsageData}>
            <BarChart data={data} accessibilityLayer margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="app"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => chartConfig[value as keyof typeof chartConfig]?.label || value}
              />
              <YAxis />
              <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
              <Bar dataKey="hours" radius={[8, 8, 0, 0]} data={appUsageData}>
                {data.map((entry) => (
                    <Cell key={`cell-${entry.app}`} fill={chartConfig[entry.app as keyof typeof chartConfig]?.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
