/* Do not change, this code is generated from Golang structs */
// eslint-disable-next-line no-restricted-imports
import { Dayjs } from "dayjs"

export interface Weekday {
  day: number
}

export interface Class {
  id: string
  school: School
  name: string
  startTime: string
  endTime: string
  weekdays: Weekday[]
}

export interface Guardian {}

export interface Image {}

export interface LessonPlan {}

export interface Student {
  id: string
  name: string
  dateOfBirth: string
  dateOfEntry: string
  note: string
  customId: string
  active: boolean
  lessonPlans: LessonPlan[]
  images: Image[]
  profileImage: Image
  guardians: Guardian[]
  classes: Class[]
}

export interface Area {}

export interface StudentReportsAreaComment {
  studentReportProgressReportId: string
  studentReportsId: string
  studentReport: StudentReport
  areaId: string

  area: Area
  comments: string
}

export interface StudentReport {
  progressReport: ProgressReport
  areaComments: StudentReportsAreaComment[]
  generalComments: string
  ready: boolean
  student: Student
}

export interface User {
  id: string
  name: string
  email: string
}

export interface School {
  id: string
  name: string
  users: User[]
}

export interface ProgressReport {
  id: string
  title: string
  periodStart: Dayjs
  periodEnd: Dayjs
  school?: School
  studentsReports: StudentReport[]
  published: boolean
}
