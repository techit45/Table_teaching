"use client"

import { useState } from "react"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"

import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { CourseForm } from "@/components/course-form"
import { InstructorForm } from "@/components/instructor-form"
import { ScheduleGrid } from "@/components/schedule-grid"
import { AppSidebar } from "@/components/app-sidebar"
import { useCourses } from "@/hooks/use-courses"
import { useInstructors } from "@/hooks/use-instructors"
import { useSchedule } from "@/hooks/use-schedule"
import { useDayInstructors } from "@/hooks/use-day-instructors"
import { Calendar, Save, Sparkles } from "lucide-react"

export default function Home() {
  const { toast } = useToast()
  const [showCourseForm, setShowCourseForm] = useState(false)
  const [showInstructorForm, setShowInstructorForm] = useState(false)
  const [editingCourse, setEditingCourse] = useState(null)
  const [editingInstructor, setEditingInstructor] = useState(null)

  const { courses, addCourse, updateCourse, deleteCourse } = useCourses()
  const { instructors, addInstructor, updateInstructor, deleteInstructor } = useInstructors()
  const { schedule, updateSchedule, removeScheduleItem, updateDuration, moveScheduleItem } = useSchedule()
  const { assignments, getInstructorsForDay, addInstructorToDay, removeInstructorFromDay, isInstructorAssignedToDay } =
    useDayInstructors()

  const handleSaveSchedule = () => {
    toast({
      title: "✅ บันทึกตารางสำเร็จ",
      description: "ข้อมูลตารางสอนได้ถูกบันทึกเรียบร้อยแล้ว",
    })
  }

  const handleAddInstructorToDay = (day: string, instructorId: string) => {
    if (isInstructorAssignedToDay(day, instructorId)) {
      toast({
        title: "⚠️ ผู้สอนอยู่ในวันนี้แล้ว",
        description: `ผู้สอนคนนี้ได้ถูกเพิ่มในวัน${day}แล้ว`,
        variant: "destructive",
      })
      return
    }

    addInstructorToDay(day, instructorId)
    const instructor = instructors.find((i) => i.id === instructorId)
    toast({
      title: "✅ เพิ่มผู้สอนสำเร็จ",
      description: `เพิ่ม ${instructor?.name} ในวัน${day}เรียบร้อยแล้ว`,
    })
  }

  const handleRemoveInstructorFromDay = (day: string, instructorId: string) => {
    removeInstructorFromDay(day, instructorId)
    const instructor = instructors.find((i) => i.id === instructorId)
    toast({
      title: "🗑️ ลบผู้สอนแล้ว",
      description: `ลบ ${instructor?.name} จากวัน${day}แล้ว`,
    })
  }

  const handleDeleteCourseFromSchedule = (scheduleItemId: string) => {
    removeScheduleItem(scheduleItemId)
    toast({
      title: "🗑️ ลบรายวิชาแล้ว",
      description: "ลบรายวิชาออกจากตารางเรียบร้อยแล้ว",
    })
  }

  // Convert assignments to the format expected by ScheduleGrid
  const assignedInstructorIds = assignments.reduce(
    (acc, assignment) => {
      acc[assignment.day] = assignment.instructorIds
      return acc
    },
    {} as { [day: string]: string[] },
  )

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
        {/* Sidebar */}
        <div className="w-80 shadow-xl">
          <AppSidebar
            courses={courses}
            instructors={instructors}
            onAddCourse={() => {
              setEditingCourse(null)
              setShowCourseForm(true)
            }}
            onEditCourse={(course) => {
              setEditingCourse(course)
              setShowCourseForm(true)
            }}
            onDeleteCourse={handleDeleteCourseFromSchedule}
            onAddInstructor={() => {
              setEditingInstructor(null)
              setShowInstructorForm(true)
            }}
            onEditInstructor={(instructor) => {
              setEditingInstructor(instructor)
              setShowInstructorForm(true)
            }}
            onDeleteInstructor={deleteInstructor}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="border-b border-blue-200/50 bg-white/80 backdrop-blur-sm px-8 py-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    ระบบจัดการตารางสอน
                  </h1>
                  <p className="text-blue-600/70 mt-1 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    ตารางสอนวันเสาร์-อาทิตย์ • ลากเพื่อจัดการ • ปรับขนาดได้
                  </p>
                </div>
              </div>
              <Button
                onClick={handleSaveSchedule}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                size="lg"
              >
                <Save className="w-4 h-4 mr-2" />
                บันทึกตาราง
              </Button>
            </div>
          </header>

          {/* Schedule Grid */}
          <main className="flex-1 p-8">
            <div className="rounded-2xl border border-blue-200/50 bg-white/50 backdrop-blur-sm shadow-xl">
              <div className="p-6 border-b border-blue-200/50 bg-gradient-to-r from-blue-50/50 to-indigo-50/50">
                <h2 className="text-xl font-bold text-blue-900 mb-2">ตารางสอนสุดสัปดาห์</h2>
                <div className="flex flex-wrap gap-4 text-sm text-blue-600/80">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span>ลากผู้สอนมาวางในวัน</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span>ลากรายวิชาไปช่องเวลา</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                    <span>ลากขอบขวาเพื่อปรับเวลา</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span>ลากกลับ Sidebar เพื่อลบ</span>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <ScheduleGrid
                  instructors={instructors}
                  courses={courses}
                  schedule={schedule}
                  assignedInstructorIds={assignedInstructorIds}
                  onUpdateSchedule={updateSchedule}
                  onRemoveScheduleItem={removeScheduleItem}
                  onUpdateDuration={updateDuration}
                  onMoveScheduleItem={moveScheduleItem}
                  onAddInstructorToDay={handleAddInstructorToDay}
                  onRemoveInstructorFromDay={handleRemoveInstructorFromDay}
                />
              </div>
            </div>
          </main>
        </div>

        {/* Forms */}
        {showCourseForm && (
          <CourseForm
            course={editingCourse}
            onSave={(course) => {
              if (editingCourse) {
                updateCourse(course)
              } else {
                addCourse(course)
              }
              setShowCourseForm(false)
            }}
            onCancel={() => setShowCourseForm(false)}
          />
        )}

        {showInstructorForm && (
          <InstructorForm
            instructor={editingInstructor}
            onSave={(instructor) => {
              if (editingInstructor) {
                updateInstructor(instructor)
              } else {
                addInstructor(instructor)
              }
              setShowInstructorForm(false)
            }}
            onCancel={() => setShowInstructorForm(false)}
          />
        )}
      </div>
    </DndProvider>
  )
}
