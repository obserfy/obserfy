/* Do not change, this code is generated from Golang structs */

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
  periodStart: Date
  periodEnd: Date
  school?: School
}
