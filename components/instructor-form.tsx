"use client"

import type React from "react"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { Instructor } from "@/lib/types"

interface InstructorFormProps {
  instructor: Instructor | null
  onSave: (instructor: Instructor) => void
  onCancel: () => void
}

export function InstructorForm({ instructor, onSave, onCancel }: InstructorFormProps) {
  const [formData, setFormData] = useState<Instructor>(
    instructor || {
      id: crypto.randomUUID(),
      name: "",
      expertise: "",
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
          <DialogTitle>{instructor ? "แก้ไขข้อมูลผู้สอน" : "เพิ่มผู้สอนใหม่"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">ชื่อ-นามสกุล</Label>
              <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="expertise">ความเชี่ยวชาญ</Label>
              <Textarea id="expertise" name="expertise" value={formData.expertise} onChange={handleChange} rows={3} />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onCancel}>
              ยกเลิก
            </Button>
            <Button type="submit">{instructor ? "บันทึกการแก้ไข" : "เพิ่มผู้สอน"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
