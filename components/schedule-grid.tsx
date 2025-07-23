"use client"

import type React from "react"

import { useMemo, useState, useRef, useCallback } from "react"
import { X, Move, Clock, Users, GraduationCap } from "lucide-react"
import { useDrop, useDrag } from "react-dnd"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { InstructorSelectorDialog } from "@/components/instructor-selector-dialog"
import type { Course, Instructor, ScheduleItem } from "@/lib/types"
import { cn } from "@/lib/utils"

interface ScheduleGridProps {
  instructors: Instructor[]
  courses: Course[]
  schedule: ScheduleItem[]
  assignedInstructorIds: { [day: string]: string[] }
  onUpdateSchedule: (item: ScheduleItem) => void
  onRemoveScheduleItem: (id: string) => void
  onUpdateDuration: (id: string, duration: number) => void
  onMoveScheduleItem: (id: string, newDay: string, newTime: string, newInstructorId: string) => void
  onAddInstructorToDay: (day: string, instructorId: string) => void
  onRemoveInstructorFromDay: (day: string, instructorId: string) => void
}

export function ScheduleGrid({
  instructors,
  courses,
  schedule,
  assignedInstructorIds,
  onUpdateSchedule,
  onRemoveScheduleItem,
  onUpdateDuration,
  onMoveScheduleItem,
  onAddInstructorToDay,
  onRemoveInstructorFromDay,
}: ScheduleGridProps) {
  const days = ["เสาร์", "อาทิตย์"]
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

  const [showInstructorSelector, setShowInstructorSelector] = useState(false)
  const [selectedDay, setSelectedDay] = useState("")

  // Create a lookup map for schedule items
  const scheduleMap = useMemo(() => {
    const map = new Map()
    schedule.forEach((item) => {
      const key = `${item.day}-${item.instructorId}`
      if (!map.has(key)) {
        map.set(key, [])
      }
      map.get(key).push(item)
    })
    return map
  }, [schedule])

  // Find course by ID
  const findCourse = (courseId: string) => {
    return courses.find((c) => c.id === courseId)
  }

  // Find instructor by ID
  const findInstructor = (instructorId: string) => {
    return instructors.find((i) => i.id === instructorId)
  }

  // Get time slot index
  const getTimeIndex = (time: string) => {
    return timeSlots.indexOf(time)
  }

  // Check if a time slot is occupied by a course
  const isTimeSlotOccupied = (day: string, instructorId: string, timeIndex: number) => {
    const key = `${day}-${instructorId}`
    const daySchedule = scheduleMap.get(key) || []

    return daySchedule.some((item) => {
      const startIndex = getTimeIndex(item.startTime)
      const endIndex = startIndex + item.duration
      return timeIndex >= startIndex && timeIndex < endIndex
    })
  }

  // Get schedule item at specific time
  const getScheduleItemAtTime = (day: string, instructorId: string, timeIndex: number) => {
    const key = `${day}-${instructorId}`
    const daySchedule = scheduleMap.get(key) || []

    return daySchedule.find((item) => {
      const startIndex = getTimeIndex(item.startTime)
      const endIndex = startIndex + item.duration
      return timeIndex >= startIndex && timeIndex < endIndex
    })
  }

  const handleAddInstructorClick = (day: string) => {
    setSelectedDay(day)
    setShowInstructorSelector(true)
  }

  const handleSelectInstructor = (instructorId: string) => {
    onAddInstructorToDay(selectedDay, instructorId)
  }

  const handleRemoveInstructor = (day: string, instructorId: string) => {
    // Remove instructor from day and also remove all their schedule items for that day
    const itemsToRemove = schedule.filter((item) => item.day === day && item.instructorId === instructorId)
    itemsToRemove.forEach((item) => onRemoveScheduleItem(item.id))
    onRemoveInstructorFromDay(day, instructorId)
  }

  if (instructors.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-xl border-2 border-dashed border-primary/20 bg-gradient-to-br from-blue-50/50 to-indigo-50/50">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
            <GraduationCap className="w-8 h-8 text-primary" />
          </div>
          <div>
            <p className="text-lg font-semibold text-primary">ยังไม่มีผู้สอน</p>
            <p className="text-sm text-muted-foreground mt-1">เพิ่มผู้สอนเพื่อเริ่มจัดตารางสอน</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="overflow-auto custom-scrollbar rounded-xl border bg-gradient-to-br from-slate-50/50 to-blue-50/30">
        <div className="min-w-[1200px]">
          {/* Header - Time slots */}
          <div
            className="grid gap-0 border-b bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
            style={{ gridTemplateColumns: `280px repeat(${timeSlots.length}, 90px)` }}
          >
            <div className="p-4 border-r border-blue-500/30 font-semibold flex items-center gap-2">
              <Clock className="w-4 h-4" />
              วัน / เวลา
            </div>
            {timeSlots.map((time) => (
              <div
                key={time}
                className="p-3 border-r border-blue-500/30 text-center font-medium text-sm last:border-r-0"
              >
                {time}
              </div>
            ))}
          </div>

          {/* Days and Instructors */}
          {days.map((day, dayIndex) => {
            const dayInstructorIds = assignedInstructorIds[day] || []
            const dayInstructors = dayInstructorIds.map((id) => findInstructor(id)).filter(Boolean)

            return (
              <div key={day}>
                {/* Day header with instructor management */}
                <DayDropZone
                  day={day}
                  dayIndex={dayIndex}
                  instructorCount={dayInstructors.length}
                  timeSlots={timeSlots}
                  onAddInstructorClick={() => handleAddInstructorClick(day)}
                  onDropInstructor={onAddInstructorToDay}
                />

                {/* Instructors for this day */}
                {dayInstructors.length === 0 ? (
                  <div
                    className="grid gap-0 border-b bg-gradient-to-r from-slate-50 to-blue-50/30"
                    style={{ gridTemplateColumns: `280px repeat(${timeSlots.length}, 90px)` }}
                  >
                    <div className="p-4 border-r text-center text-muted-foreground bg-gradient-to-r from-slate-100/50 to-blue-100/30">
                      <div className="space-y-2">
                        <Users className="w-5 h-5 mx-auto text-primary/60" />
                        <div className="text-sm font-medium">ไม่มีผู้สอนในวันนี้</div>
                        <div className="text-xs">ลากผู้สอนมาวางที่นี่</div>
                      </div>
                    </div>
                    {timeSlots.map((time) => (
                      <div
                        key={`${day}-empty-${time}`}
                        className="border-r last:border-r-0 h-20 bg-gradient-to-b from-slate-50/30 to-transparent"
                      ></div>
                    ))}
                  </div>
                ) : (
                  dayInstructors.map((instructor, instructorIndex) => (
                    <div
                      key={`${day}-${instructor.id}`}
                      className={cn(
                        "grid gap-0 border-b transition-colors hover:bg-blue-50/30",
                        instructorIndex % 2 === 0 ? "bg-white/50" : "bg-slate-50/30",
                      )}
                      style={{ gridTemplateColumns: `280px repeat(${timeSlots.length}, 90px)` }}
                    >
                      <div className="p-4 border-r bg-gradient-to-r from-blue-50/50 to-indigo-50/30">
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-sm text-blue-900 truncate flex items-center gap-2">
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              {instructor.name}
                            </div>
                            <div className="text-xs text-blue-600/70 truncate mt-1">{instructor.expertise}</div>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 w-7 p-0 ml-2 text-red-500 hover:text-red-600 hover:bg-red-50"
                            onClick={() => handleRemoveInstructor(day, instructor.id)}
                            title="ลบผู้สอนจากวันนี้"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>

                      {timeSlots.map((time, timeIndex) => {
                        const scheduleItem = getScheduleItemAtTime(day, instructor.id, timeIndex)
                        const course = scheduleItem ? findCourse(scheduleItem.courseId) : null
                        const isOccupied = isTimeSlotOccupied(day, instructor.id, timeIndex)
                        const isStartOfCourse = scheduleItem && getTimeIndex(scheduleItem.startTime) === timeIndex

                        return (
                          <div key={`${day}-${instructor.id}-${time}`} className="border-r last:border-r-0 relative">
                            {isStartOfCourse && scheduleItem && course ? (
                              <ResizableCourseBlock
                                scheduleItem={scheduleItem}
                                course={course}
                                duration={scheduleItem.duration}
                                onRemove={() => onRemoveScheduleItem(scheduleItem.id)}
                                onUpdateDuration={(newDuration) => onUpdateDuration(scheduleItem.id, newDuration)}
                                onMove={onMoveScheduleItem}
                                maxDuration={Math.min(6, timeSlots.length - timeIndex)}
                              />
                            ) : !isOccupied ? (
                              <ScheduleCell
                                day={day}
                                time={time}
                                instructorId={instructor.id}
                                onUpdateSchedule={onUpdateSchedule}
                                onMoveScheduleItem={onMoveScheduleItem}
                              />
                            ) : (
                              <div className="h-20"></div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  ))
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Instructor Selector Dialog */}
      <InstructorSelectorDialog
        open={showInstructorSelector}
        onClose={() => setShowInstructorSelector(false)}
        instructors={instructors}
        assignedInstructorIds={assignedInstructorIds[selectedDay] || []}
        day={selectedDay}
        onSelectInstructor={handleSelectInstructor}
      />
    </>
  )
}

interface DayDropZoneProps {
  day: string
  dayIndex: number
  instructorCount: number
  timeSlots: string[]
  onAddInstructorClick: () => void
  onDropInstructor: (day: string, instructorId: string) => void
}

function DayDropZone({
  day,
  dayIndex,
  instructorCount,
  timeSlots,
  onAddInstructorClick,
  onDropInstructor,
}: DayDropZoneProps) {
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: ["instructor"],
    drop: (item: any) => {
      if (item.type === "instructor") {
        onDropInstructor(day, item.id)
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
  })

  const dayColors = ["from-emerald-500 to-teal-600", "from-purple-500 to-indigo-600"]

  return (
    <div
      ref={drop}
      className={cn(
        "grid gap-0 border-b transition-all duration-300 drop-zone",
        isOver && canDrop && "active bg-blue-50/50",
      )}
      style={{ gridTemplateColumns: `280px repeat(${timeSlots.length}, 90px)` }}
    >
      <div
        className={cn(
          "p-4 border-r transition-all duration-300",
          `bg-gradient-to-r ${dayColors[dayIndex]} text-white`,
          isOver && canDrop && "scale-105 shadow-lg",
        )}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <span className="text-sm font-bold">{dayIndex + 1}</span>
            </div>
            <div>
              <span className="font-bold text-lg">{day}</span>
              {isOver && canDrop && (
                <div className="flex items-center gap-1 text-xs text-white/90 mt-1">
                  <Users className="h-3 w-3" />
                  <span>วางผู้สอนที่นี่</span>
                </div>
              )}
            </div>
          </div>
          <Button
            size="sm"
            variant="ghost"
            className="h-8 w-8 p-0 text-white hover:bg-white/20"
            onClick={onAddInstructorClick}
            title="เพิ่มผู้สอนในวันนี้"
          >
            <X className="h-4 w-4 rotate-45" />
          </Button>
        </div>
        <div className="text-xs text-white/80 mt-2 flex items-center gap-2">
          <Users className="h-3 w-3" />
          <span>ผู้สอน: {instructorCount} คน</span>
        </div>
      </div>
      {timeSlots.map((time) => (
        <div
          key={`${day}-${time}-header`}
          className={cn(
            "border-r last:border-r-0 h-16 transition-all duration-300",
            `bg-gradient-to-b ${dayColors[dayIndex]}/10 to-transparent`,
            isOver && canDrop && "bg-blue-100/50",
          )}
        ></div>
      ))}
    </div>
  )
}

interface ScheduleCellProps {
  day: string
  time: string
  instructorId: string
  onUpdateSchedule: (item: ScheduleItem) => void
  onMoveScheduleItem: (id: string, newDay: string, newTime: string, newInstructorId: string) => void
}

function ScheduleCell({ day, time, instructorId, onUpdateSchedule, onMoveScheduleItem }: ScheduleCellProps) {
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: ["course", "schedule-item"],
    drop: (item: any) => {
      if (item.type === "course") {
        const newScheduleItem: ScheduleItem = {
          id: crypto.randomUUID(),
          day,
          startTime: time,
          duration: 1,
          instructorId,
          courseId: item.id,
        }
        onUpdateSchedule(newScheduleItem)
      } else if (item.type === "schedule-item") {
        onMoveScheduleItem(item.id, day, time, instructorId)
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
        "h-20 w-full transition-all duration-200 flex items-center justify-center group",
        isOver && canDrop && "bg-blue-100/50 border-2 border-blue-300/50 border-dashed scale-105",
        "hover:bg-blue-50/30",
      )}
    >
      <div
        className={cn(
          "text-xs text-muted-foreground/60 text-center transition-opacity",
          isOver && canDrop ? "opacity-100" : "opacity-0 group-hover:opacity-100",
        )}
      >
        <div className="w-6 h-6 mx-auto mb-1 bg-blue-100 rounded-full flex items-center justify-center">
          <X className="h-3 w-3 rotate-45 text-blue-500" />
        </div>
        <div className="text-[10px]">วางรายวิชา</div>
      </div>
    </div>
  )
}

interface ResizableCourseBlockProps {
  scheduleItem: ScheduleItem
  course: Course
  duration: number
  maxDuration: number
  onRemove: () => void
  onUpdateDuration: (duration: number) => void
  onMove: (id: string, newDay: string, newTime: string, newInstructorId: string) => void
}

function ResizableCourseBlock({
  scheduleItem,
  course,
  duration,
  maxDuration,
  onRemove,
  onUpdateDuration,
  onMove,
}: ResizableCourseBlockProps) {
  const [isResizing, setIsResizing] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [tempDuration, setTempDuration] = useState(duration)
  const blockRef = useRef<HTMLDivElement>(null)

  const [{ isDraggingItem }, drag, dragPreview] = useDrag(() => ({
    type: "schedule-item",
    item: {
      type: "schedule-item",
      id: scheduleItem.id,
      courseId: scheduleItem.courseId,
      originalDay: scheduleItem.day,
      originalTime: scheduleItem.startTime,
      originalInstructorId: scheduleItem.instructorId,
    },
    collect: (monitor) => ({
      isDraggingItem: !!monitor.isDragging(),
    }),
  }))

  const handleResizeStart = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setIsResizing(true)
      setTempDuration(duration)

      const startX = e.clientX
      const startDuration = duration
      const cellWidth = 90

      const handleMouseMove = (e: MouseEvent) => {
        const deltaX = e.clientX - startX
        const deltaHours = Math.round(deltaX / cellWidth)
        const newDuration = Math.max(1, Math.min(maxDuration, startDuration + deltaHours))
        setTempDuration(newDuration)
      }

      const handleMouseUp = () => {
        setIsResizing(false)
        onUpdateDuration(tempDuration)
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)
        document.body.style.cursor = ""
        document.body.style.userSelect = ""
      }

      document.body.style.cursor = "ew-resize"
      document.body.style.userSelect = "none"
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
    },
    [duration, maxDuration, onUpdateDuration, tempDuration],
  )

  const currentDuration = isResizing ? tempDuration : duration

  return (
    <div
      ref={dragPreview}
      className={cn(
        "absolute inset-0 z-10 flex flex-col rounded-lg border-2 p-3 transition-all duration-200 course-block",
        isDraggingItem && "opacity-60 scale-95",
        isResizing && "shadow-lg scale-105 z-20",
        "bg-gradient-to-br from-white to-blue-50/30 border-blue-200 shadow-sm",
      )}
      style={{
        width: `${currentDuration * 90}px`,
        minHeight: "76px",
        borderColor: course.locationColor,
        background: `linear-gradient(135deg, ${course.locationColor}15, ${course.locationColor}05)`,
      }}
    >
      {/* Header with controls */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div
            ref={drag}
            className="cursor-move p-1.5 rounded-md hover:bg-white/50 transition-colors"
            title="ลากเพื่อย้ายตำแหน่ง"
          >
            <Move className="h-3 w-3 text-blue-600" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-sm truncate text-blue-900">{course.name}</div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Badge variant="secondary" className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 border-blue-200">
            {currentDuration} ชม.
          </Badge>
          <Button
            size="sm"
            variant="ghost"
            className="h-6 w-6 p-0 hover:bg-red-50 hover:text-red-600 transition-colors"
            onClick={onRemove}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Course details */}
      <div className="flex-1 flex flex-col justify-between">
        <div className="text-xs text-blue-600/80 truncate mb-2">{course.location}</div>
        <div className="mt-auto">
          <Badge
            variant="outline"
            className="text-xs px-2 py-0.5 border-0"
            style={{
              backgroundColor: course.companyColor + "20",
              color: course.companyColor,
            }}
          >
            {course.company}
          </Badge>
        </div>
      </div>

      {/* Enhanced Resize handle */}
      <div
        className={cn(
          "absolute right-0 top-0 bottom-0 w-4 cursor-ew-resize flex items-center justify-center transition-all duration-200 resize-handle",
          isResizing ? "bg-blue-200/50 w-6" : "hover:bg-blue-100/30",
        )}
        onMouseDown={handleResizeStart}
        title="ลากเพื่อปรับขนาด"
      >
        <div
          className={cn(
            "w-1 h-8 bg-blue-400 rounded-full transition-all duration-200",
            isResizing && "bg-blue-600 h-12 w-1.5",
          )}
        ></div>
      </div>

      {/* Resize indicator */}
      {isResizing && (
        <div className="absolute -top-8 right-0 bg-blue-600 text-white text-xs px-2 py-1 rounded-md shadow-lg">
          {tempDuration} ชั่วโมง
        </div>
      )}
    </div>
  )
}
