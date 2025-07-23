"use client"

import { useState } from "react"
import type { Instructor } from "@/lib/types"

// Sample data
const initialInstructors: Instructor[] = [
  {
    id: "1",
    name: "อาจารย์สมชาย ใจดี",
    expertise: "JavaScript, React, Node.js",
  },
  {
    id: "2",
    name: "อาจารย์สมหญิง รักสอน",
    expertise: "UI/UX Design, Figma, Adobe XD",
  },
  {
    id: "3",
    name: "ดร.วิชัย เชี่ยวชาญ",
    expertise: "Data Science, Python, Machine Learning",
  },
]

export function useInstructors() {
  const [instructors, setInstructors] = useState<Instructor[]>(initialInstructors)

  const addInstructor = (instructor: Instructor) => {
    setInstructors((prev) => [...prev, instructor])
  }

  const updateInstructor = (updatedInstructor: Instructor) => {
    setInstructors((prev) =>
      prev.map((instructor) => (instructor.id === updatedInstructor.id ? updatedInstructor : instructor)),
    )
  }

  const deleteInstructor = (id: string) => {
    setInstructors((prev) => prev.filter((instructor) => instructor.id !== id))
  }

  return {
    instructors,
    addInstructor,
    updateInstructor,
    deleteInstructor,
  }
}
