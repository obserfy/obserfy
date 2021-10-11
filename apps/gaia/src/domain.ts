import { Dayjs } from "$lib/dayjs"

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

interface Link {
  id: string
  url: string
  title?: string
  description?: string
  image?: string
}

export interface LessonPlan {
  id: string
  title: string
  description: string
  repetitionType: number
  startDate: string
  endDate: string
  area?: Area
  student: Children[]
  links: Link[]
  observations: Observation[]
}

export interface Observation {
  id: string
  observation: string
  createdAt: string
}

export const materialStageToString = (stage: number) => {
  if (stage === 0) {
    return "Presented"
  }
  if (stage === 1) {
    return "Practiced"
  }
  if (stage === 2) {
    return "Mastered"
  }
  return ""
}
