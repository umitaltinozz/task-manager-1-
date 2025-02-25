"use client"

import { useState } from "react"
import { format, subMonths, startOfMonth, endOfMonth } from "date-fns"
import { tr } from "date-fns/locale"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useTaskContext, type TaskType } from "./providers"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts"

export function StatsView() {
  const { state } = useTaskContext()
  const [currentDate, setCurrentDate] = useState(new Date())

  const previousMonth = () => {
    setCurrentDate((date) => subMonths(date, 1))
  }

  const nextMonth = () => {
    setCurrentDate((date) => subMonths(date, -1))
  }

  // Ay başı ve sonu
  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)

  // Seçili ay için görevleri filtrele
  const monthTasks = state.tasks.filter((task) => {
    const [day, month] = task.date.split(".")
    const taskDate = new Date(currentDate.getFullYear(), Number.parseInt(month) - 1, Number.parseInt(day))
    return taskDate >= monthStart && taskDate <= monthEnd
  })

  // Durum bazlı istatistikler
  const statusStats = {
    completed: monthTasks.filter((task) => task.status === "completed").length,
    failed: monthTasks.filter((task) => task.status === "failed").length,
    pending: monthTasks.filter((task) => task.status === "pending").length,
  }

  // Tür bazlı istatistikler
  const typeStats = monthTasks.reduce(
    (acc, task) => {
      acc[task.type] = (acc[task.type] || 0) + 1
      return acc
    },
    {} as Record<TaskType, number>,
  )

  const typeData = Object.entries(typeStats).map(([name, value]) => ({
    name,
    value,
  }))

  // Günlük görev dağılımı
  const dailyStats = monthTasks.reduce(
    (acc, task) => {
      acc[task.date] = (acc[task.date] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const dailyData = Object.entries(dailyStats)
    .map(([date, count]) => ({
      date,
      count,
    }))
    .sort((a, b) => {
      const [dayA, monthA] = a.date.split(".")
      const [dayB, monthB] = b.date.split(".")
      return Number.parseInt(monthA + dayA) - Number.parseInt(monthB + dayB)
    })

  const COLORS = {
    completed: "#22c55e",
    failed: "#ef4444",
    pending: "#94a3b8",
  }

  const TYPE_COLORS = [
    "#3b82f6", // blue-500
    "#f97316", // orange-500
    "#8b5cf6", // violet-500
    "#06b6d4", // cyan-500
  ]

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">İstatistikler</h1>
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

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Tamamlanan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{statusStats.completed}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Yapılmayan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{statusStats.failed}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Bekleyen</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{statusStats.pending}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Durum Dağılımı</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: "Tamamlanan", value: statusStats.completed },
                      { name: "Yapılmayan", value: statusStats.failed },
                      { name: "Bekleyen", value: statusStats.pending },
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    <Cell fill={COLORS.completed} />
                    <Cell fill={COLORS.failed} />
                    <Cell fill={COLORS.pending} />
                  </Pie>
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Görev Türü Dağılımı</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={typeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {typeData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={TYPE_COLORS[index % TYPE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Günlük Görev Dağılımı</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

