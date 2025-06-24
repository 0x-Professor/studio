"use client";

import { useEffect, useState, type ComponentProps } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Cell } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import type { AppUsage } from "@/types";
import { BarChartBig } from "lucide-react";

interface AppUsageChartProps {}

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

export function AppUsageChart({}: AppUsageChartProps) {
  const [appUsageData, setAppUsageData] = useState<AppUsage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/app-usage");
        if (!response.ok) {
          throw new Error("Failed to fetch app usage data");
        }
        const data = await response.json();
        setAppUsageData(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <Card className="glassmorphic h-full flex flex-col">
      <CardHeader>
        <div className="flex flex-row items-center gap-4">
          <BarChartBig className="h-6 w-6 text-primary text-glow" />
          <CardTitle className="font-headline">App Usage Today</CardTitle>
        </div>
        <CardDescription>Your most used applications today.</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        {isLoading ? (
            <div className="flex items-center justify-center h-full min-h-[300px]">
                <p className="text-muted-foreground">Loading chart data...</p>
            </div>
        ) : (
            <ChartContainer config={chartConfig} className="w-full h-full min-h-[300px]">
              <BarChart data={appUsageData} accessibilityLayer>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" />
                  <XAxis
                  dataKey="app"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => chartConfig[value as keyof typeof chartConfig]?.label || value}
                  />
                  <YAxis stroke="hsl(var(--foreground) / 0.8)"/>
                  <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                  <Bar dataKey="hours" radius={[8, 8, 0, 0]}>
                  {appUsageData.map((entry) => (
                      <Cell key={`cell-${entry.app}`} fill={chartConfig[entry.app as keyof typeof chartConfig]?.color} />
                      ))}
                  </Bar>
              </BarChart>
            </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
