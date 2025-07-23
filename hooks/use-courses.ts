"use client"

import { useState } from "react"
import type { Course } from "@/lib/types"

// Sample data
const initialCourses: Course[] = [
  {
    id: "1",
    name: "การเขียนโปรแกรมเบื้องต้น",
    description: "พื้นฐานการเขียนโปรแกรมด้วยภาษา JavaScript",
    company: "CodeAcademy",
    companyColor: "#6366f1",
    location: "ห้อง 101",
    locationColor: "#3b82f6",
  },
  {
    id: "2",
    name: "การออกแบบ UI/UX",
    description: "หลักการออกแบบส่วนติดต่อผู้ใช้และประสบการณ์ผู้ใช้",
    company: "DesignHub",
    companyColor: "#ec4899",
    location: "ห้อง 202",
    locationColor: "#8b5cf6",
  },
  {
    id: "3",
    name: "การวิเคราะห์ข้อมูล",
    description: "การวิเคราะห์ข้อมูลด้วย Python และ Pandas",
    company: "DataWiz",
    companyColor: "#10b981",
    location: "ห้องปฏิบัติการ",
    locationColor: "#14b8a6",
  },
]

export function useCourses() {
  const [courses, setCourses] = useState<Course[]>(initialCourses)

  const addCourse = (course: Course) => {
    setCourses((prev) => [...prev, course])
  }

  const updateCourse = (updatedCourse: Course) => {
    setCourses((prev) => prev.map((course) => (course.id === updatedCourse.id ? updatedCourse : course)))
  }

  const deleteCourse = (id: string) => {
    setCourses((prev) => prev.filter((course) => course.id !== id))
  }

  return {
    courses,
    addCourse,
    updateCourse,
    deleteCourse,
  }
}
