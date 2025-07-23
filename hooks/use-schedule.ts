"use client"

import { useState } from "react"
import type { ScheduleItem } from "@/lib/types"

// Sample data with new structure
const initialSchedule: ScheduleItem[] = [
  {
    id: "1",
    day: "เสาร์",
    startTime: "09:00",
    duration: 2,
    instructorId: "1",
    courseId: "1",
  },
  {
    id: "2",
    day: "อาทิตย์",
    startTime: "10:00",
    duration: 3,
    instructorId: "2",
    courseId: "2",
  },
  {
    id: "3",
    day: "เสาร์",
    startTime: "14:00",
    duration: 1,
    instructorId: "3",
    courseId: "3",
  },
]

export function useSchedule() {
  const [schedule, setSchedule] = useState<ScheduleItem[]>(initialSchedule)

  const updateSchedule = (newItem: ScheduleItem) => {
    // Check for conflicts before adding
    const hasConflict = schedule.some((existingItem) => {
      if (existingItem.day !== newItem.day || existingItem.instructorId !== newItem.instructorId) {
        return false
      }

      const existingStart = getTimeIndex(existingItem.startTime)
      const existingEnd = existingStart + existingItem.duration
      const newStart = getTimeIndex(newItem.startTime)
      const newEnd = newStart + newItem.duration

      return newStart < existingEnd && newEnd > existingStart
    })

    if (!hasConflict) {
      setSchedule((prev) => [...prev, newItem])
    }
  }

  const removeScheduleItem = (id: string) => {
    setSchedule((prev) => prev.filter((item) => item.id !== id))
  }

  const updateDuration = (id: string, duration: number) => {
    setSchedule((prev) => prev.map((item) => (item.id === id ? { ...item, duration } : item)))
  }

  const moveScheduleItem = (id: string, newDay: string, newTime: string, newInstructorId: string) => {
    setSchedule((prev) => {
      const itemToMove = prev.find((item) => item.id === id)
      if (!itemToMove) return prev

      const updatedItem = {
        ...itemToMove,
        day: newDay,
        startTime: newTime,
        instructorId: newInstructorId,
      }

      // Check for conflicts at the new position
      const hasConflict = prev.some((existingItem) => {
        if (existingItem.id === id) return false // Skip the item being moved
        if (existingItem.day !== newDay || existingItem.instructorId !== newInstructorId) {
          return false
        }

        const existingStart = getTimeIndex(existingItem.startTime)
        const existingEnd = existingStart + existingItem.duration
        const newStart = getTimeIndex(newTime)
        const newEnd = newStart + updatedItem.duration

        return newStart < existingEnd && newEnd > existingStart
      })

      if (!hasConflict) {
        return prev.map((item) => (item.id === id ? updatedItem : item))
      }

      return prev // Return unchanged if there's a conflict
    })
  }

  return {
    schedule,
    updateSchedule,
    removeScheduleItem,
    updateDuration,
    moveScheduleItem,
  }
}

// Helper function to get time index
function getTimeIndex(time: string): number {
  const timeSlots = [
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
    "19:00",
    "20:00",
  ]
  return timeSlots.indexOf(time)
}
