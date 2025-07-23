"use client"

import type React from "react"

import { useDrag } from "react-dnd"
import type { Instructor } from "@/lib/types"

interface DraggableInstructorProps {
  instructor: Instructor
  children: React.ReactNode
}

export function DraggableInstructor({ instructor, children }: DraggableInstructorProps) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "instructor",
    item: {
      type: "instructor",
      id: instructor.id,
      name: instructor.name,
      expertise: instructor.expertise,
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }))

  return (
    <div ref={drag} className="cursor-grab active:cursor-grabbing" style={{ opacity: isDragging ? 0.5 : 1 }}>
      {children}
    </div>
  )
}
