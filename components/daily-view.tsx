"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DailyTasks } from "./daily-tasks"
import { TaskForm } from "./task-form"
import { useTaskContext } from "./providers"

export function DailyView({ date }: { date: string }) {
  const [activeTab, setActiveTab] = useState("tasks")
  const { state } = useTaskContext()

  const dailyTasks = state.tasks.filter((task) => task.date === date)

  return (
    <div className="max-w-4xl mx-auto">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="tasks">Görevler {dailyTasks.length > 0 && `(${dailyTasks.length})`}</TabsTrigger>
          <TabsTrigger value="add">Görev Ekle</TabsTrigger>
        </TabsList>
        <TabsContent value="tasks">
          <Card>
            <CardContent className="pt-6">
              <DailyTasks date={date} tasks={dailyTasks} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="add">
          <Card>
            <CardContent className="pt-6">
              <TaskForm onSuccess={() => setActiveTab("tasks")} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

