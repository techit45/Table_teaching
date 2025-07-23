"use client"

import { useState } from "react"
import type { DayInstructorAssignment } from "@/lib/types"

// Initial assignments - which instructors are assigned to which days
const initialAssignments: DayInstructorAssignment[] = [
  {
    day: "เสาร์",
    instructorIds: ["1", "2", "3"], // All instructors initially assigned to Saturday
  },
  {
    day: "อาทิตย์",
    instructorIds: ["1", "2"], // Only instructors 1 and 2 assigned to Sunday
  },
]

export function useDayInstructors() {
  const [assignments, setAssignments] = useState<DayInstructorAssignment[]>(initialAssignments)

  const getInstructorsForDay = (day: string): string[] => {
    const assignment = assignments.find((a) => a.day === day)
    return assignment ? assignment.instructorIds : []
  }

  const addInstructorToDay = (day: string, instructorId: string) => {
    setAssignments((prev) => {
      const existingAssignment = prev.find((a) => a.day === day)

      if (existingAssignment) {
        // Check if instructor is already assigned to this day
        if (existingAssignment.instructorIds.includes(instructorId)) {
          return prev // Already assigned, no change
        }

        // Add instructor to existing day assignment
        return prev.map((a) => (a.day === day ? { ...a, instructorIds: [...a.instructorIds, instructorId] } : a))
      } else {
        // Create new day assignment
        return [...prev, { day, instructorIds: [instructorId] }]
      }
    })
  }

  const removeInstructorFromDay = (day: string, instructorId: string) => {
    setAssignments((prev) =>
      prev.map((a) =>
        a.day === day ? { ...a, instructorIds: a.instructorIds.filter((id) => id !== instructorId) } : a,
      ),
    )
  }

  const isInstructorAssignedToDay = (day: string, instructorId: string): boolean => {
    const assignment = assignments.find((a) => a.day === day)
    return assignment ? assignment.instructorIds.includes(instructorId) : false
  }

  return {
    assignments,
    getInstructorsForDay,
    addInstructorToDay,
    removeInstructorFromDay,
    isInstructorAssignedToDay,
  }
}
