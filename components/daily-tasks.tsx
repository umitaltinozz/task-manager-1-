"use client"

import { Check, Clock, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useTaskContext, type Task } from "./providers"
import { generateTimeSlots } from "@/lib/utils"

interface DailyTasksProps {
  date: string
  tasks: Task[]
}

export function DailyTasks({ date, tasks }: DailyTasksProps) {
  const { dispatch } = useTaskContext()
  const timeSlots = generateTimeSlots()

  // Sadece 01:00-06:00 arası görevleri filtrele
  const filteredTasks = tasks.filter((task) => {
    const hour = Number.parseInt(task.time.split(":")[0])
    return hour >= 1 && hour <= 6
  })

  // Görevleri saatlerine göre grupla
  const tasksByTime = filteredTasks.reduce(
    (acc, task) => {
      if (!acc[task.time]) {
        acc[task.time] = []
      }
      acc[task.time].push(task)
      return acc
    },
    {} as Record<string, Task[]>,
  )

  const getStatusColor = (status: Task["status"]) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "failed":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
    }
  }

  const updateStatus = (id: string, status: Task["status"]) => {
    dispatch({ type: "UPDATE_TASK", id, updates: { status } })
  }

  const deleteTask = (id: string) => {
    dispatch({ type: "DELETE_TASK", id })
  }

  if (filteredTasks.length === 0) {
    return <div className="text-center py-8 text-muted-foreground">Bu zaman diliminde görev bulunmuyor.</div>
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">{date} Görevleri</h2>
      <div className="space-y-2">
        {timeSlots.map((timeSlot) => {
          const tasksAtTime = tasksByTime[timeSlot] || []
          if (tasksAtTime.length === 0) return null

          return (
            <div key={timeSlot} className="space-y-2">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{timeSlot}</span>
              </div>
              {tasksAtTime.map((task) => (
                <div key={task.id} className={`rounded-lg border p-4 ${getStatusColor(task.status)}`}>
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">{task.title}</h3>
                    <Badge variant="secondary">{task.type}</Badge>
                  </div>
                  {task.description && <p className="mt-1 text-sm text-muted-foreground">{task.description}</p>}
                  <div className="mt-4 flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-green-500 text-white hover:bg-green-600"
                      onClick={() => updateStatus(task.id, "completed")}
                    >
                      <Check className="mr-1 h-4 w-4" />
                      Yapıldı
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-red-500 text-white hover:bg-red-600"
                      onClick={() => updateStatus(task.id, "failed")}
                    >
                      <X className="mr-1 h-4 w-4" />
                      Yapılmadı
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => deleteTask(task.id)}>
                      Sil
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )
        })}
      </div>
    </div>
  )
}

