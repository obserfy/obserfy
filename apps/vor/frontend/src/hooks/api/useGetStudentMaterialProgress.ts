import { useQuery } from "react-query"
import { t } from "@lingui/macro"
import { navigate } from "../../components/Link/Link"
import { useQueryCache } from "../useQueryCache"
import { BASE_URL } from "./useApi"

export enum MaterialProgressStage {
  PRESENTED,
  PRACTICED,
  MASTERED,
}
export interface MaterialProgress {
  areaId: string
  materialName: string
  materialId: string
  stage: MaterialProgressStage
  updatedAt: string
}

const KEY = (studentId: string) => ["studentCurriculumProgress", studentId]

const fetchMaterialProgress = (studentId: string) => async (): Promise<
  MaterialProgress[]
> => {
  const result = await fetch(
    `${BASE_URL}/students/${studentId}/materialsProgress`,
    { credentials: "same-origin" }
  )
  if (result.status === 401) {
    navigate("/login")
    return []
  }
  return result.json()
}

export function useGetStudentMaterialProgress(studentId: string) {
  return useQuery(KEY(studentId), fetchMaterialProgress(studentId))
}

export const useGetStudentMaterialProgressCache = (studentId: string) => {
  return useQueryCache<MaterialProgress[]>(KEY(studentId))
}

export function materialStageToString(stage?: MaterialProgressStage) {
  let status
  switch (stage) {
    case MaterialProgressStage.MASTERED:
      status = t`Mastered`
      break
    case MaterialProgressStage.PRACTICED:
      status = t`Practiced`
      break
    case MaterialProgressStage.PRESENTED:
      status = t`Presented`
      break
    default:
      return ""
  }
  return status
}
