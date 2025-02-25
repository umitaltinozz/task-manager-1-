"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { addMonths, eachDayOfInterval, endOfMonth, format, startOfMonth, isSameMonth } from "date-fns"
import { tr } from "date-fns/locale"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTaskContext } from "./providers"
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"

export function MonthlyView() {
  const router = useRouter()
  const { state } = useTaskContext()
  const [currentDate, setCurrentDate] = useState(new Date())

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const previousMonth = () => {
    setCurrentDate((date) => addMonths(date, -1))
  }

  const nextMonth = () => {
    setCurrentDate((date) => addMonths(date, 1))
  }

  const navigateToDay = (date: string) => {
    router.push(`/${date}`)
  }

  const getTaskStats = (date: Date) => {
    const dateStr = format(date, "dd.MM")
    const dayTasks = state.tasks.filter((task) => task.date === dateStr)

    const completed = dayTasks.filter((task) => task.status === "completed").length
    const failed = dayTasks.filter((task) => task.status === "failed").length
    const pending = dayTasks.filter((task) => task.status === "pending").length
    const total = dayTasks.length

    return {
      completed,
      failed,
      pending,
      total,
      hasData: total > 0,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
    }
  }

  const COLORS = {
    completed: "#22c55e", // green-500
    failed: "#ef4444", // red-500
    pending: "#94a3b8", // slate-400
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Aylık Görünüm</h1>
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="icon" onClick={previousMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="font-medium">{format(currentDate, "MMMM yyyy", { locale: tr })}</span>
          <Button variant="outline" size="icon" onClick={nextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-4">
        {/* Gün isimleri */}
        {["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"].map((day) => (
          <div key={day} className="text-center font-medium py-2">
            {day}
          </div>
        ))}

        {/* Boş günler (ay başındaki) */}
        {Array.from({ length: monthStart.getDay() || 7 }).map((_, index) => (
          <div key={`empty-start-${index}`} className="h-32" />
        ))}

        {/* Ayın günleri */}
        {days.map((day) => {
          const dateStr = format(day, "dd.MM")
          const stats = getTaskStats(day)
          const isCurrentMonth = isSameMonth(day, currentDate)

          if (!isCurrentMonth) return <div key={day.toString()} className="h-32" />

          const data = [
            { name: "Tamamlandı", value: stats.completed, color: COLORS.completed },
            { name: "Yapılmadı", value: stats.failed, color: COLORS.failed },
            { name: "Beklemede", value: stats.pending, color: COLORS.pending },
          ].filter((item) => item.value > 0)

          return (
            <div
              key={day.toString()}
              className="h-32 border rounded-lg p-2 cursor-pointer hover:border-primary"
              onClick={() => navigateToDay(dateStr)}
            >
              <div className="text-right text-sm mb-2">{format(day, "d")}</div>
              {stats.hasData ? (
                <div className="h-20 flex flex-col items-center justify-center">
                  <div className="relative w-16 h-16">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={data}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          innerRadius={20}
                          outerRadius={30}
                        >
                          {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex items-center justify-center text-sm font-medium">
                      %{stats.completionRate}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-20 flex items-center justify-center text-sm text-muted-foreground">Görev yok</div>
              )}
            </div>
          )
        })}

        {/* Boş günler (ay sonundaki) */}
        {Array.from({ length: (7 - (monthEnd.getDay() || 7)) % 7 }).map((_, index) => (
          <div key={`empty-end-${index}`} className="h-32" />
        ))}
      </div>

      <div className="flex items-center justify-center space-x-4 text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS.completed }} />
          <span>Tamamlandı</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS.failed }} />
          <span>Yapılmadı</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS.pending }} />
          <span>Beklemede</span>
        </div>
      </div>
    </div>
  )
}

