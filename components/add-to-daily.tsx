"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { TopicTask } from "./providers"
import { generateTimeSlots } from "@/lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface AddToDailyProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  task: TopicTask | null
  onAdd: (date: string, time: string) => void
}

export function AddToDaily({ open, onOpenChange, task, onAdd }: AddToDailyProps) {
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  const timeSlots = generateTimeSlots()

  const handleAdd = () => {
    if (date && time) {
      onAdd(date, time)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Günlük Programa Ekle</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Tarih</label>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Saat</label>
            <Select onValueChange={setTime} value={time}>
              <SelectTrigger>
                <SelectValue placeholder="Saat seçin" />
              </SelectTrigger>
              <SelectContent>
                {timeSlots.map((slot) => (
                  <SelectItem key={slot} value={slot}>
                    {slot}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleAdd} className="w-full">
            Programa Ekle
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

