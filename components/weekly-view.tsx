"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { addDays, format, startOfWeek } from "date-fns"
import { tr } from "date-fns/locale"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTaskContext } from "./providers"
import { Badge } from "./ui/badge"

export function WeeklyView() {
  const router = useRouter()
  const { state } = useTaskContext()
  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date(), { locale: tr }))

  const days = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(weekStart, i)
    const dateStr = format(date, "dd.MM")
    const dayName = format(date, "EEEE", { locale: tr })

    const dayTasks = state.tasks.filter((task) => task.date === dateStr)

    return {
      date: dateStr,
      dayName,
      tasks: dayTasks,
    }
  })

  const previousWeek = () => {
    setWeekStart((date) => addDays(date, -7))
  }

  const nextWeek = () => {
    setWeekStart((date) => addDays(date, 7))
  }

  const navigateToDay = (date: string) => {
    router.push(`/${date}`)
  }

  const getStatusColor = (status: "completed" | "failed" | "pending") => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "failed":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Haftalık Görünüm</h1>
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="icon" onClick={previousWeek}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="font-medium">
            {format(weekStart, "d MMMM", { locale: tr })} - {format(addDays(weekStart, 6), "d MMMM", { locale: tr })}
          </span>
          <Button variant="outline" size="icon" onClick={nextWeek}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-7">
        {days.map(({ date, dayName, tasks }) => (
          <div
            key={date}
            className="border rounded-lg p-4 cursor-pointer hover:border-primary"
            onClick={() => navigateToDay(date)}
          >
            <div className="font-medium mb-2">
              <div>{dayName}</div>
              <div className="text-sm text-muted-foreground">{date}</div>
            </div>
            <div className="space-y-2">
              {tasks.length === 0 ? (
                <p className="text-sm text-muted-foreground">Görev yok</p>
              ) : (
                tasks.map((task) => (
                  <div key={task.id} className={`text-sm p-2 rounded-md ${getStatusColor(task.status)}`}>
                    <div className="flex items-center justify-between">
                      <span>{task.time}</span>
                      <Badge variant="outline" className="text-xs">
                        {task.type}
                      </Badge>
                    </div>
                    <div className="font-medium mt-1">{task.title}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

