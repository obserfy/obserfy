import { Dayjs } from "./utils/dayjs"

export interface Area {
  id: string
  name: string
}

export interface Children {
  id: string
  name: string
  dateOfBirth?: Dayjs
  dateOfEntry?: Dayjs
}

export interface LessonPlan {
  id: string
  title: string
  description: string
  date: Dayjs
  area?: Area
  student: Children[]
}
