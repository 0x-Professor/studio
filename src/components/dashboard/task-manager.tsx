"use client";

import { useState, useEffect, useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ListChecks, Plus } from "lucide-react";
import type { Task } from "@/types";
import { getTasksAction, addTaskAction, toggleTaskAction } from "@/app/actions";
import { cn } from "@/lib/utils";

export function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const [isPending, startTransition] = useTransition();

  const loadTasks = () => {
    startTransition(async () => {
      const fetchedTasks = await getTasksAction();
      setTasks(fetchedTasks);
    });
  };

  useEffect(() => {
    loadTasks();
    const interval = setInterval(loadTasks, 1000); // Refresh tasks every second
    return () => clearInterval(interval);
  }, []);

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTask.trim() === "") return;
    
    startTransition(async () => {
        await addTaskAction(newTask);
        setNewTask("");
        loadTasks();
    });
  };

  const handleToggleTask = (id: number) => {
    startTransition(async () => {
        await toggleTaskAction(id);
        loadTasks();
    });
  };

  return (
    <Card className="glassmorphic h-full flex flex-col">
      <CardHeader className="flex flex-row items-center gap-4 space-y-0">
        <ListChecks className="h-6 w-6 text-primary text-glow" />
        <CardTitle className="font-headline">Task Manager</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col flex-grow gap-4">
        <form onSubmit={handleAddTask} className="flex gap-2">
          <Input
            placeholder="Add a new task..."
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            disabled={isPending}
            className="bg-input/50 focus:bg-input"
          />
          <Button type="submit" size="icon" aria-label="Add task" disabled={isPending}>
            <Plus className="h-4 w-4" />
          </Button>
        </form>
        <ScrollArea className="flex-grow h-48">
          <div className="space-y-2 pr-4">
            {isPending && tasks.length === 0 ? (
                <p className="text-muted-foreground text-sm text-center py-4">Syncing tasks...</p>
            ) : tasks.length === 0 ? (
                <p className="text-muted-foreground text-sm text-center py-4">No tasks yet. Add one above.</p>
            ) : (
                tasks.map((task) => (
                <div key={task.id} className="flex items-center space-x-3 transition-all bg-muted/20 hover:bg-muted/40 p-2 rounded-md">
                    <Checkbox
                    id={`task-${task.id}`}
                    checked={task.completed}
                    onCheckedChange={() => handleToggleTask(task.id)}
                    aria-labelledby={`task-label-${task.id}`}
                    disabled={isPending}
                    />
                    <label
                    id={`task-label-${task.id}`}
                    htmlFor={`task-${task.id}`}
                    className={cn("flex-grow text-sm cursor-pointer transition-colors",
                        task.completed ? "text-muted-foreground line-through" : "text-foreground"
                    )}
                    >
                    {task.text}
                    </label>
                </div>
                ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
