"use client"

import type React from "react"

import { useDrag } from "react-dnd"
import type { Course } from "@/lib/types"

interface DraggableCourseProps {
  course: Course
  children: React.ReactNode
}

export function DraggableCourse({ course, children }: DraggableCourseProps) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "course",
    item: { type: "course", id: course.id },
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
