"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ListTodo, Plus } from "lucide-react";

type Task = {
  id: number;
  text: string;
  completed: boolean;
};

const initialTasks: Task[] = [
  { id: 1, text: "Call John at 6 PM", completed: false },
  { id: 2, text: "Finish project proposal", completed: true },
  { id: 3, text: "Buy groceries", completed: false },
  { id: 4, text: "Schedule dentist appointment", completed: false },
  { id: 5, text: "Read a chapter of a book", completed: true },
];

export function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [newTask, setNewTask] = useState("");

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTask.trim() === "") return;
    const newTaskObj: Task = {
      id: Date.now(),
      text: newTask,
      completed: false,
    };
    setTasks([newTaskObj, ...tasks]);
    setNewTask("");
  };

  const toggleTask = (id: number) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-row items-center gap-4 space-y-0">
        <ListTodo className="h-6 w-6 text-primary" />
        <CardTitle className="font-headline">Task Manager</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col flex-grow gap-4">
        <form onSubmit={handleAddTask} className="flex gap-2">
          <Input
            placeholder="Add a new task..."
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
          />
          <Button type="submit" size="icon" aria-label="Add task">
            <Plus className="h-4 w-4" />
          </Button>
        </form>
        <ScrollArea className="flex-grow h-48">
          <div className="space-y-4 pr-4">
            {tasks.map((task) => (
              <div key={task.id} className="flex items-center space-x-3 transition-all hover:bg-muted/50 p-2 rounded-md">
                <Checkbox
                  id={`task-${task.id}`}
                  checked={task.completed}
                  onCheckedChange={() => toggleTask(task.id)}
                  aria-labelledby={`task-label-${task.id}`}
                />
                <label
                  id={`task-label-${task.id}`}
                  htmlFor={`task-${task.id}`}
                  className={`flex-grow text-sm cursor-pointer transition-colors ${
                    task.completed ? "text-muted-foreground line-through" : ""
                  }`}
                >
                  {task.text}
                </label>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
