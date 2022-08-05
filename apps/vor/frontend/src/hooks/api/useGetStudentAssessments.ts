import { useQuery } from "react-query"
import { navigate } from "../../components/Link/Link"
import { useQueryCache } from "../useQueryCache"
import { BASE_URL } from "./useApi"

export enum Assessment {
  PRESENTED,
  PRACTICED,
  MASTERED,
}
export interface MaterialProgress {
  areaId: string
  materialName: string
  materialId: string
  stage: Assessment
  updatedAt: string
}

const KEY = (studentId: string) => ["studentCurriculumProgress", studentId]

const fetchMaterialProgress =
  (studentId: string) => async (): Promise<MaterialProgress[]> => {
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

export function useGetStudentAssessments(studentId: string) {
  return useQuery(KEY(studentId), fetchMaterialProgress(studentId))
}

export const useGetStudentMaterialProgressCache = (studentId: string) => {
  return useQueryCache<MaterialProgress[]>(KEY(studentId))
}

export function materialStageToString(stage?: Assessment) {
  let status
  switch (stage) {
    case Assessment.MASTERED:
      status = `Mastered`
      break
    case Assessment.PRACTICED:
      status = `Practiced`
      break
    case Assessment.PRESENTED:
      status = `Presented`
      break
    default:
      return ""
  }
  return status
}
