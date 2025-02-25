"use client"

import type React from "react"
import { createContext, useContext, useReducer, useEffect } from "react"
import { AuthProvider } from "@/components/auth-provider"

export type TaskType = "Okul Dersi" | "Yazılım" | "TYT" | "İngilizce"

export type Task = {
  id: string
  date: string
  time: string
  title: string
  description: string
  type: TaskType
  status: "pending" | "completed" | "failed"
  isRecurring: boolean
  recurringDays?: number[]
  hasNotification: boolean
  email?: string
}

export type Topic = {
  id: string
  title: string
  tasks: TopicTask[]
}

export type TopicTask = {
  id: string
  title: string
  description: string
  status: "pending" | "completed" | "failed"
  addedToDaily: boolean
}

type TaskState = {
  tasks: Task[]
  topics: Topic[]
}

type TaskAction =
  | { type: "ADD_TASK"; task: Task }
  | { type: "UPDATE_TASK"; id: string; updates: Partial<Task> }
  | { type: "DELETE_TASK"; id: string }
  | { type: "ADD_TOPIC"; topic: Topic }
  | { type: "DELETE_TOPIC"; id: string }
  | { type: "ADD_TOPIC_TASK"; topicId: string; task: TopicTask }
  | { type: "UPDATE_TOPIC_TASK"; topicId: string; taskId: string; updates: Partial<TopicTask> }
  | { type: "DELETE_TOPIC_TASK"; topicId: string; taskId: string }
  | { type: "LOAD_STATE"; state: TaskState }

const TaskContext = createContext<{
  state: TaskState
  dispatch: React.Dispatch<TaskAction>
} | null>(null)

function taskReducer(state: TaskState, action: TaskAction): TaskState {
  let newState: TaskState

  switch (action.type) {
    case "ADD_TASK":
      newState = {
        ...state,
        tasks: [...state.tasks, action.task],
      }
      break

    case "UPDATE_TASK":
      newState = {
        ...state,
        tasks: state.tasks.map((task) => (task.id === action.id ? { ...task, ...action.updates } : task)),
      }
      break

    case "DELETE_TASK":
      newState = {
        ...state,
        tasks: state.tasks.filter((task) => task.id !== action.id),
      }
      break

    case "ADD_TOPIC":
      newState = {
        ...state,
        topics: [...state.topics, action.topic],
      }
      break

    case "DELETE_TOPIC":
      newState = {
        ...state,
        topics: state.topics.filter((topic) => topic.id !== action.id),
      }
      break

    case "ADD_TOPIC_TASK":
      newState = {
        ...state,
        topics: state.topics.map((topic) =>
          topic.id === action.topicId ? { ...topic, tasks: [...topic.tasks, action.task] } : topic,
        ),
      }
      break

    case "UPDATE_TOPIC_TASK":
      newState = {
        ...state,
        topics: state.topics.map((topic) =>
          topic.id === action.topicId
            ? {
                ...topic,
                tasks: topic.tasks.map((task) => (task.id === action.taskId ? { ...task, ...action.updates } : task)),
              }
            : topic,
        ),
      }
      break

    case "DELETE_TOPIC_TASK":
      newState = {
        ...state,
        topics: state.topics.map((topic) =>
          topic.id === action.topicId
            ? {
                ...topic,
                tasks: topic.tasks.filter((task) => task.id !== action.taskId),
              }
            : topic,
        ),
      }
      break

    case "LOAD_STATE":
      newState = action.state
      break

    default:
      return state
  }

  if (typeof window !== "undefined") {
    localStorage.setItem("taskManagerState", JSON.stringify(newState))
  }
  return newState
}

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(taskReducer, {
    tasks: [],
    topics: [],
  })

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedState = localStorage.getItem("taskManagerState")
      if (savedState) {
        try {
          const parsedState = JSON.parse(savedState)
          dispatch({ type: "LOAD_STATE", state: parsedState })
        } catch (error) {
          console.error("Error loading state from localStorage:", error)
        }
      }
    }
  }, [])

  return <TaskContext.Provider value={{ state, dispatch }}>{children}</TaskContext.Provider>
}

export function useTaskContext() {
  const context = useContext(TaskContext)
  if (!context) {
    throw new Error("useTaskContext must be used within a TaskProvider")
  }
  return context
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <TaskProvider>{children}</TaskProvider>
    </AuthProvider>
  )
}

