"use client"

import type React from "react"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { Course } from "@/lib/types"

interface CourseFormProps {
  course: Course | null
  onSave: (course: Course) => void
  onCancel: () => void
}

export function CourseForm({ course, onSave, onCancel }: CourseFormProps) {
  const [formData, setFormData] = useState<Course>(
    course || {
      id: crypto.randomUUID(),
      name: "",
      description: "",
      company: "",
      companyColor: "#6366f1",
      location: "",
      locationColor: "#3b82f6",
    },
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{course ? "แก้ไขรายวิชา" : "เพิ่มรายวิชาใหม่"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">ชื่อวิชา</Label>
              <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">รายละเอียดเบื้องต้น</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="company">บริษัทที่รับผิดชอบ</Label>
                <Input id="company" name="company" value={formData.company} onChange={handleChange} required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="companyColor">สีบริษัท</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    id="companyColor"
                    name="companyColor"
                    value={formData.companyColor}
                    onChange={handleChange}
                    className="h-10 w-10 p-1"
                  />
                  <Input
                    type="text"
                    value={formData.companyColor}
                    onChange={handleChange}
                    name="companyColor"
                    className="flex-1"
                  />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="location">สถานที่สอน</Label>
                <Input id="location" name="location" value={formData.location} onChange={handleChange} required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="locationColor">สีสถานที่</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    id="locationColor"
                    name="locationColor"
                    value={formData.locationColor}
                    onChange={handleChange}
                    className="h-10 w-10 p-1"
                  />
                  <Input
                    type="text"
                    value={formData.locationColor}
                    onChange={handleChange}
                    name="locationColor"
                    className="flex-1"
                  />
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onCancel}>
              ยกเลิก
            </Button>
            <Button type="submit">{course ? "บันทึกการแก้ไข" : "เพิ่มรายวิชา"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
