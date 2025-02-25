"use client"

import { DailyView } from "@/components/daily-view"

export default function DailyPage({ params }: { params: { date: string } }) {
  return <DailyView date={params.date} />
}

