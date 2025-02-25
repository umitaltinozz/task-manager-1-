"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { v4 as uuidv4 } from "uuid"
import { Plus, Trash2, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { useTaskContext, type TopicTask } from "./providers"
import { AddToDaily } from "./add-to-daily"

export function TopicsView() {
  const router = useRouter()
  const { toast } = useToast()
  const { state, dispatch } = useTaskContext()
  const [newTopicTitle, setNewTopicTitle] = useState("")
  const [newTask, setNewTask] = useState({ title: "", description: "" })
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null)
  const [showAddToDaily, setShowAddToDaily] = useState(false)
  const [selectedTask, setSelectedTask] = useState<TopicTask | null>(null)

  const handleAddTopic = () => {
    if (!newTopicTitle.trim()) return

    dispatch({
      type: "ADD_TOPIC",
      topic: {
        id: uuidv4(),
        title: newTopicTitle,
        tasks: [],
      },
    })

    setNewTopicTitle("")
  }

  const handleDeleteTopic = (topicId: string) => {
    dispatch({ type: "DELETE_TOPIC", id: topicId })
  }

  const handleAddTask = (topicId: string) => {
    if (!newTask.title.trim()) return

    // Duplicate kontrol
    const topic = state.topics.find((t) => t.id === topicId)
    const isDuplicate = topic?.tasks.some((task) => task.title.toLowerCase() === newTask.title.toLowerCase())

    if (isDuplicate) {
      toast({
        title: "Hata",
        description: "Bu görev zaten eklenmiş!",
        variant: "destructive",
      })
      return
    }

    dispatch({
      type: "ADD_TOPIC_TASK",
      topicId,
      task: {
        id: uuidv4(),
        title: newTask.title,
        description: newTask.description,
        status: "pending",
        addedToDaily: false,
      },
    })

    setNewTask({ title: "", description: "" })
    setSelectedTopicId(null)
  }

  const handleUpdateTaskStatus = (topicId: string, taskId: string, status: TopicTask["status"]) => {
    dispatch({
      type: "UPDATE_TOPIC_TASK",
      topicId,
      taskId,
      updates: { status },
    })
  }

  const handleDeleteTask = (topicId: string, taskId: string) => {
    dispatch({
      type: "DELETE_TOPIC_TASK",
      topicId,
      taskId,
    })
  }

  const openAddToDaily = (task: TopicTask) => {
    setSelectedTask(task)
    setShowAddToDaily(true)
  }

  const getStatusColor = (status: TopicTask["status"]) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "failed":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Konular</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Yeni Konu
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Yeni Konu Ekle</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Konu başlığı"
                value={newTopicTitle}
                onChange={(e) => setNewTopicTitle(e.target.value)}
              />
              <Button onClick={handleAddTopic} className="w-full">
                Ekle
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {state.topics.map((topic) => (
          <Card key={topic.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-bold">{topic.title}</CardTitle>
              <Button variant="ghost" size="icon" onClick={() => handleDeleteTopic(topic.id)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full" onClick={() => setSelectedTopicId(topic.id)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Görev Ekle
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Yeni Görev Ekle</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Input
                      placeholder="Görev başlığı"
                      value={newTask.title}
                      onChange={(e) => setNewTask((prev) => ({ ...prev, title: e.target.value }))}
                    />
                    <Textarea
                      placeholder="Görev açıklaması"
                      value={newTask.description}
                      onChange={(e) => setNewTask((prev) => ({ ...prev, description: e.target.value }))}
                    />
                    <Button onClick={() => handleAddTask(topic.id)} className="w-full">
                      Ekle
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              <div className="space-y-2">
                {topic.tasks.map((task) => (
                  <div key={task.id} className={`p-3 rounded-lg ${getStatusColor(task.status)}`}>
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{task.title}</h4>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openAddToDaily(task)}
                        disabled={task.addedToDaily}
                      >
                        <Calendar className="w-4 h-4" />
                      </Button>
                    </div>
                    {task.description && <p className="mt-1 text-sm">{task.description}</p>}
                    <div className="mt-2 flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="bg-green-500 text-white hover:bg-green-600"
                        onClick={() => handleUpdateTaskStatus(topic.id, task.id, "completed")}
                      >
                        Yapıldı
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="bg-red-500 text-white hover:bg-red-600"
                        onClick={() => handleUpdateTaskStatus(topic.id, task.id, "failed")}
                      >
                        Yapılmadı
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleDeleteTask(topic.id, task.id)}>
                        Sil
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <AddToDaily
        open={showAddToDaily}
        onOpenChange={setShowAddToDaily}
        task={selectedTask}
        onAdd={(date, time) => {
          if (selectedTask) {
            // Günlük göreve ekle
            dispatch({
              type: "ADD_TASK",
              task: {
                id: uuidv4(),
                date,
                time,
                title: selectedTask.title,
                description: selectedTask.description,
                type: "Okul Dersi", // Varsayılan tip
                status: "pending",
                isRecurring: false,
                hasNotification: false,
              },
            })

            // Konu görevini güncelle
            const topic = state.topics.find((t) => t.tasks.some((task) => task.id === selectedTask.id))
            if (topic) {
              dispatch({
                type: "UPDATE_TOPIC_TASK",
                topicId: topic.id,
                taskId: selectedTask.id,
                updates: { addedToDaily: true },
              })
            }

            setShowAddToDaily(false)
            setSelectedTask(null)

            toast({
              title: "Başarılı",
              description: "Görev günlük programa eklendi.",
            })
          }
        }}
      />
    </div>
  )
}

