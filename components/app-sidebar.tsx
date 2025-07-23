"use client"

import { Edit, MoreHorizontal, PlusCircle, Trash, BookOpen, Users, GraduationCap } from "lucide-react"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { DraggableCourse } from "./draggable-course"
import { DraggableInstructor } from "./draggable-instructor"
import { DeleteDropZone } from "./delete-drop-zone"
import type { Course, Instructor } from "@/lib/types"

interface AppSidebarProps {
  courses: Course[]
  instructors: Instructor[]
  onAddCourse: () => void
  onEditCourse: (course: Course) => void
  onDeleteCourse: (id: string) => void
  onAddInstructor: () => void
  onEditInstructor: (instructor: Instructor) => void
  onDeleteInstructor: (id: string) => void
}

export function AppSidebar({
  courses,
  instructors,
  onAddCourse,
  onEditCourse,
  onDeleteCourse,
  onAddInstructor,
  onEditInstructor,
  onDeleteInstructor,
}: AppSidebarProps) {
  return (
    <div className="flex h-screen flex-col bg-gradient-to-b from-blue-50/50 to-indigo-50/30 border-r border-blue-200/50">
      {/* Header */}
      <div className="p-6 border-b border-blue-200/50 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">จัดการตาราง</h2>
            <p className="text-xs text-blue-100">ระบบจัดการตารางสอน</p>
          </div>
        </div>
      </div>

      {/* Delete Drop Zone */}
      <DeleteDropZone onDeleteCourse={onDeleteCourse} />

      <div className="flex-1 p-4">
        <Tabs defaultValue="courses" className="h-full">
          <TabsList className="grid w-full grid-cols-2 bg-white/50 border border-blue-200/50">
            <TabsTrigger value="courses" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <BookOpen className="w-4 h-4 mr-2" />
              รายวิชา
            </TabsTrigger>
            <TabsTrigger value="instructors" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <Users className="w-4 h-4 mr-2" />
              ผู้สอน
            </TabsTrigger>
          </TabsList>

          <TabsContent value="courses" className="mt-4 h-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-blue-900 flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                รายวิชาทั้งหมด ({courses.length})
              </h3>
              <Button size="sm" onClick={onAddCourse} className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm">
                <PlusCircle className="h-4 w-4 mr-2" />
                เพิ่มรายวิชา
              </Button>
            </div>

            <ScrollArea className="h-[calc(100vh-320px)] custom-scrollbar">
              <div className="space-y-3">
                {courses.map((course) => (
                  <div key={course.id} className="group relative">
                    <DraggableCourse course={course}>
                      <div className="flex items-center gap-3 p-4 rounded-xl border border-blue-200/50 bg-white/70 hover:bg-white hover:shadow-md transition-all duration-200 cursor-grab active:cursor-grabbing backdrop-blur-sm">
                        <div
                          className="h-5 w-5 rounded-lg flex-shrink-0 shadow-sm"
                          style={{ backgroundColor: course.locationColor }}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold truncate text-blue-900">{course.name}</div>
                          <div className="text-sm text-blue-600/70 truncate">{course.location}</div>
                          <div className="text-xs text-muted-foreground truncate mt-1">{course.company}</div>
                        </div>
                      </div>
                    </DraggableCourse>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 h-7 w-7 p-0 hover:bg-blue-100"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-white/95 backdrop-blur-sm">
                        <DropdownMenuItem onClick={() => onEditCourse(course)} className="hover:bg-blue-50">
                          <Edit className="mr-2 h-4 w-4" />
                          แก้ไข
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onDeleteCourse(course.id)}
                          className="text-destructive focus:text-destructive hover:bg-red-50"
                        >
                          <Trash className="mr-2 h-4 w-4" />
                          ลบ
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ))}

                {courses.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-4">
                      <BookOpen className="w-8 h-8 text-blue-500" />
                    </div>
                    <div className="text-sm font-medium">ยังไม่มีรายวิชา</div>
                    <div className="text-xs mt-1">คลิกปุ่มเพิ่มรายวิชาเพื่อเริ่มต้น</div>
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="instructors" className="mt-4 h-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-blue-900 flex items-center gap-2">
                <Users className="w-4 h-4" />
                ผู้สอนทั้งหมด ({instructors.length})
              </h3>
              <Button
                size="sm"
                onClick={onAddInstructor}
                className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                เพิ่มผู้สอน
              </Button>
            </div>

            <ScrollArea className="h-[calc(100vh-320px)] custom-scrollbar">
              <div className="space-y-3">
                {instructors.map((instructor) => (
                  <div key={instructor.id} className="group relative">
                    <DraggableInstructor instructor={instructor}>
                      <div className="flex items-center gap-3 p-4 rounded-xl border border-blue-200/50 bg-white/70 hover:bg-white hover:shadow-md transition-all duration-200 cursor-grab active:cursor-grabbing backdrop-blur-sm">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                          {instructor.name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold truncate text-blue-900">{instructor.name}</div>
                          <div className="text-sm text-blue-600/70 truncate">{instructor.expertise}</div>
                        </div>
                      </div>
                    </DraggableInstructor>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 h-7 w-7 p-0 hover:bg-blue-100"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-white/95 backdrop-blur-sm">
                        <DropdownMenuItem onClick={() => onEditInstructor(instructor)} className="hover:bg-blue-50">
                          <Edit className="mr-2 h-4 w-4" />
                          แก้ไข
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onDeleteInstructor(instructor.id)}
                          className="text-destructive focus:text-destructive hover:bg-red-50"
                        >
                          <Trash className="mr-2 h-4 w-4" />
                          ลบ
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ))}

                {instructors.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-4">
                      <Users className="w-8 h-8 text-blue-500" />
                    </div>
                    <div className="text-sm font-medium">ยังไม่มีผู้สอน</div>
                    <div className="text-xs mt-1">คลิกปุ่มเพิ่มผู้สอนเพื่อเริ่มต้น</div>
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
