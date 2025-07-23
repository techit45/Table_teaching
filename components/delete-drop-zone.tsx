"use client"

import { Trash2, AlertTriangle } from "lucide-react"
import { useDrop } from "react-dnd"
import { cn } from "@/lib/utils"

interface DeleteDropZoneProps {
  onDeleteCourse: (courseId: string) => void
}

export function DeleteDropZone({ onDeleteCourse }: DeleteDropZoneProps) {
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: ["schedule-item"],
    drop: (item: any) => {
      if (item.type === "schedule-item") {
        onDeleteCourse(item.id)
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
  })

  return (
    <div
      ref={drop}
      className={cn(
        "mx-4 mt-3 p-4 border-2 border-dashed rounded-xl transition-all duration-300",
        isOver && canDrop
          ? "border-red-400 bg-gradient-to-r from-red-50 to-pink-50 text-red-600 scale-105 shadow-lg"
          : "border-red-200/50 text-red-400 hover:border-red-300 hover:bg-red-50/30",
      )}
    >
      <div className="flex items-center justify-center gap-3">
        {isOver && canDrop ? (
          <>
            <AlertTriangle className="h-5 w-5 animate-pulse" />
            <span className="text-sm font-semibold">วางเพื่อลบรายวิชา</span>
          </>
        ) : (
          <>
            <Trash2 className="h-4 w-4" />
            <span className="text-sm font-medium">ลากรายวิชามาที่นี่เพื่อลบ</span>
          </>
        )}
      </div>
    </div>
  )
}
