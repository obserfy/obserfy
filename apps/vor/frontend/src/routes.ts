import { Dayjs } from "./dayjs"

export const NEW_STUDENT_URL = "/dashboard/students/new"
export const ADMIN_URL = "/dashboard/admin"
export const NEW_CLASS_URL = "/dashboard/admin/class/new"
export const CLASS_SETTINGS_URL = "/dashboard/admin/class"
export const STUDENTS_URL = "/dashboard/students"
export const NEW_STUDENT_ADD_GUARDIAN_URL =
  "/dashboard/students/new/add-guardian"
export const ADMIN_CURRICULUM_URL = "/dashboard/admin/curriculum"
export const ADMIN_USERS_URL = "/dashboard/admin/users"
export const ADMIN_STUDENTS_URL = "/dashboard/admin/students"
export const ADMIN_INVITE_USER_URL = "/dashboard/admin/inviteUser"
export const ADMIN_SUBSCRIPTION_URL = "/dashboard/admin/subscription"
export const ADMIN_SUBSCRIPTION_SUCCESS_URL =
  "/dashboard/admin/subscription/success"
export const SUPPORT_URL = "/dashboard/support"
export const ADMIN_GUARDIAN_URL = "/dashboard/admin/guardians"
export const NEW_GUARDIAN_ADMIN_URL = "/dashboard/admin/guardians/new"

export const CURRICULUM_AREA_URL = (areaId: string): string =>
  `/dashboard/admin/curriculum/area?areaId=${areaId}`

export const NEW_SUBJECT_URL = (areaId: string): string =>
  `/dashboard/admin/curriculum/subjects/new?areaId=${areaId}`

export const EDIT_SUBJECT_URL = (areaId: string, subjectId: string): string =>
  `/dashboard/admin/curriculum/subjects/edit?subjectId=${subjectId}&areaId=${areaId}`

export const EDIT_CLASS_URL = (classId: string): string =>
  `/dashboard/admin/class/edit?classId=${classId}`

export const STUDENT_OVERVIEW_URL = (studentId: string): string =>
  `/dashboard/students/overview?studentId=${studentId}`

export const STUDENT_GALLERY_URL = (studentId: string): string =>
  `/dashboard/students/gallery?studentId=${studentId}`

export const STUDENT_IMAGE_URL = (studentId: string, imageId: string): string =>
  `/dashboard/students/gallery/image?studentId=${studentId}&imageId=${imageId}`

export const ALL_OBSERVATIONS_PAGE_URL = (studentId: string): string =>
  `/dashboard/students/observations/all?studentId=${studentId}`

export const NEW_OBSERVATION_URL = (studentId: string): string =>
  `/dashboard/students/observations/new?studentId=${studentId}`

export const OBSERVATION_DETAILS_URL = (
  studentId: string,
  observationId: string
): string =>
  `/dashboard/students/observations/details?studentId=${studentId}&observationId=${observationId}`

export const STUDENT_OVERVIEWS_OBSERVATION_DETAILS_URL = (
  studentId: string,
  observationId: string
): string =>
  `/dashboard/students/observation-details?studentId=${studentId}&observationId=${observationId}`

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
  `/dashboard/students/profile/guardians/edit?studentId=${studentId}`

export const STUDENT_PROFILE_URL = (id: string) =>
  `/dashboard/students/profile?studentId=${id}`

export const NEW_PLANS_URL = (date?: Dayjs) =>
  `/dashboard/plans/new${date ? `?date=${date.toISOString()}` : ""}`

export const ALL_PLANS_URL = (date?: Dayjs) =>
  `/dashboard/plans${date ? `?date=${date.toISOString()}` : ""}`

export const PLANS_DETAILS_URL = (id: string) =>
  `/dashboard/plans/details?id=${id}`

export const ADD_GUARDIAN_URL = (studentId: string): string =>
  `/dashboard/students/profile/guardians/add?studentId=${studentId}`

export const EDIT_STUDENT_CLASS_URL = (id: string) =>
  `/dashboard/students/profile/classes/edit?studentId=${id}`

export const NEW_STUDENT_CLASS_URL = (id: string) =>
  `/dashboard/students/profile/classes/new?studentId=${id}`

export const STUDENT_PROGRESS_URL = (
  studentId: string,
  selectedAreaId: string
) =>
  `/dashboard/students/progress?studentId=${studentId}&areaId=${selectedAreaId}`

export const GUARDIAN_PROFILE_URL = (id: string) =>
  `/dashboard/admin/guardians/profile?id=${id}`

export const STUDENT_PROFILE_GUARDIAN_PROFILE_URL = (
  studentId: string,
  guardianId: string
) =>
  `/dashboard/students/profile/guardians/profile?studentId=${studentId}&&guardianId=${guardianId}`

export const CURRICULUM_SUBJECT_URL = (areaId: string, subjectId: string) =>
  `/dashboard/admin/curriculum/subjects?areaId=${areaId}&subjectId=${subjectId}`

export const CURRICULUM_MATERIAL_URL = (
  areaId: string,
  subjectId: string,
  materialId: string
) =>
  `/dashboard/admin/curriculum/material?areaId=${areaId}&subjectId=${subjectId}&materialId=${materialId}`

export const SCHOOL_PROFILE_URL = `/dashboard/admin/school-profile`
export const USER_PROFILE_URL = `/dashboard/admin/user-profile`

export const ALL_REPORT_URL = `/dashboard/reports`
export const NEW_REPORT_URL = `/dashboard/reports/new`

export const MANAGE_REPORT_URL = (reportId: string) =>
  `/dashboard/reports/manage?reportId=${reportId}`

export const STUDENT_REPORT_URL = (reportId: string, studentId: string) =>
  `/dashboard/reports/manage/student?reportId=${reportId}&studentId=${studentId}`
