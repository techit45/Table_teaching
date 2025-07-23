export interface Course {
  id: string
  name: string
  description: string
  company: string
  companyColor: string
  location: string
  locationColor: string
}

export interface Instructor {
  id: string
  name: string
  expertise: string
}

export interface ScheduleItem {
  id: string
  day: string
  startTime: string
  duration: number // in hours
  instructorId: string
  courseId: string
}

export interface DayInstructorAssignment {
  day: string
  instructorIds: string[]
}
