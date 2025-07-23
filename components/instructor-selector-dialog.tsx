"use client"

import { useState } from "react"
import { Check } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { Instructor } from "@/lib/types"
import { cn } from "@/lib/utils"

interface InstructorSelectorDialogProps {
  open: boolean
  onClose: () => void
  instructors: Instructor[]
  assignedInstructorIds: string[]
  day: string
  onSelectInstructor: (instructorId: string) => void
}

export function InstructorSelectorDialog({
  open,
  onClose,
  instructors,
  assignedInstructorIds,
  day,
  onSelectInstructor,
}: InstructorSelectorDialogProps) {
  const [selectedInstructorId, setSelectedInstructorId] = useState<string>("")

  const availableInstructors = instructors.filter((instructor) => !assignedInstructorIds.includes(instructor.id))

  const handleConfirm = () => {
    if (selectedInstructorId) {
      onSelectInstructor(selectedInstructorId)
      setSelectedInstructorId("")
      onClose()
    }
  }

  const handleCancel = () => {
    setSelectedInstructorId("")
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>เพิ่มผู้สอนในวัน{day}</DialogTitle>
        </DialogHeader>

        <div className="py-4">
          {availableInstructors.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>ผู้สอนทั้งหมดได้ถูกเพิ่มในวัน{day}แล้ว</p>
            </div>
          ) : (
            <ScrollArea className="h-[300px]">
              <div className="space-y-2">
                {availableInstructors.map((instructor) => (
                  <div
                    key={instructor.id}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors",
                      selectedInstructorId === instructor.id ? "bg-primary/10 border-primary" : "hover:bg-muted/50",
                    )}
                    onClick={() => setSelectedInstructorId(instructor.id)}
                  >
                    <div className="flex-1">
                      <div className="font-medium">{instructor.name}</div>
                      <div className="text-sm text-muted-foreground">{instructor.expertise}</div>
                    </div>
                    {selectedInstructorId === instructor.id && <Check className="h-4 w-4 text-primary" />}
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            ยกเลิก
          </Button>
          <Button onClick={handleConfirm} disabled={!selectedInstructorId || availableInstructors.length === 0}>
            เพิ่มผู้สอน
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
