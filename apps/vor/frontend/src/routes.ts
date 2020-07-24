import { Dayjs } from "./dayjs"

export const NEW_STUDENT_URL = "/dashboard/students/new"
export const SETTINGS_URL = "/dashboard/admin"
export const NEW_CLASS_URL = "/dashboard/admin/class/new"
export const CLASS_SETTINGS_URL = "/dashboard/admin/class"
export const STUDENTS_URL = "/dashboard/students"
export const PICK_GUARDIAN_URL = "/dashboard/students/new/pickGuardians"
export const ADMIN_CURRICULUM_URL = "/dashboard/admin/curriculum"
export const ADMIN_USERS_URL = "/dashboard/admin/users"
export const ADMIN_STUDENTS_URL = "/dashboard/admin/students"
export const ADMIN_INVITE_USER_URL = "/dashboard/admin/inviteUser"
export const SUPPORT_URL = "/dashboard/support"
export const ADMIN_GUARDIAN_URL = "/dashboard/admin/guardians"
export const NEW_GUARDIAN_ADMIN_URL = "/dashboard/admin/guardians/new"

export const CURRICULUM_AREA_URL = (areaId: string): string =>
  `/dashboard/admin/curriculum/area?id=${areaId}`

export const NEW_SUBJECT_URL = (areaId: string): string =>
  `/dashboard/admin/curriculum/subjects/new?areaId=${areaId}`

export const EDIT_SUBJECT_URL = (areaId: string, subjectId: string): string =>
  `/dashboard/admin/curriculum/subjects/edit?subjectId=${subjectId}&areaId=${areaId}`

export const EDIT_CLASS_URL = (classId: string): string =>
  `/dashboard/admin/class/edit?classId=${classId}`

export const STUDENT_OVERVIEW_PAGE_URL = (studentId: string): string =>
  `/dashboard/students/overview?id=${studentId}`

export const ALL_OBSERVATIONS_PAGE_URL = (studentId: string): string =>
  `/dashboard/students/observations/all?studentId=${studentId}`

export const NEW_OBSERVATION_URL = (studentId: string): string =>
  `/dashboard/students/observations/new?studentId=${studentId}`

export const STUDENT_PLANS_URL = (studentId: string, date?: Dayjs) =>
  `/dashboard/students/plans?studentId=${studentId}&date=${
    date?.toISOString() ?? ""
  }`

export const NEW_STUDENT_PLANS_URL = (studentId: string, date?: Dayjs) =>
  `/dashboard/students/plans/new?studentId=${studentId}&date=${
    date?.toISOString() ?? ""
  }`

export const STUDENT_PLANS_DETAILS_URL = (studentId: string, planId: string) =>
  `/dashboard/students/plans/details?studentId=${studentId}&planId=${planId}`

export const EDIT_GUARDIANS_URL = (studentId: string): string =>
  `/dashboard/students/profile/guardians/edit?id=${studentId}`

export const STUDENT_PROFILE_URL = (id: string) =>
  `/dashboard/students/profile?id=${id}`

export const NEW_PLANS_URL = (date?: Dayjs) =>
  `/dashboard/plans/new${date ? `?date=${date.toISOString()}` : ""}`

export const ALL_PLANS_URL = (date?: Dayjs) =>
  `/dashboard/plans${date ? `?date=${date.toISOString()}` : ""}`

export const PLANS_DETAILS_URL = (id: string) =>
  `/dashboard/plans/details?id=${id}`

export const NEW_GUARDIANS_URL = (studentId: string): string =>
  `/dashboard/students/profile/guardians/new?id=${studentId}`

export const EDIT_STUDENT_CLASS_URL = (id: string) =>
  `/dashboard/students/profile/classes/edit?id=${id}`

export const NEW_STUDENT_CLASS_URL = (id: string) =>
  `/dashboard/students/profile/classes/new?id=${id}`

export const STUDENT_PROGRESS_URL = (
  studentId: string,
  selectedAreaId: string
) =>
  `/dashboard/students/progress?studentId=${studentId}&areaId=${selectedAreaId}`

export const GUARDIAN_PROFILE_URL = (id: string) =>
  `/dashboard/admin/guardians/profile?id=${id}`
