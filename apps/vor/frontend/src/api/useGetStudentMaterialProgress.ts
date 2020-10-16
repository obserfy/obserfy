import { queryCache, QueryResult, useQuery } from "react-query"
import { navigate } from "gatsby"
import { t } from "@lingui/macro"
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

export function useGetStudentMaterialProgress(
  studentId: string
): QueryResult<MaterialProgress[]> {
  return useQuery(
    ["studentCurriculumProgress", studentId],
    fetchMaterialProgress(studentId)
  )
}

export function getStudentMaterialProgressCache(studentId: string) {
  return queryCache.getQueryData<MaterialProgress[]>([
    "studentCurriculumProgress",
    studentId,
  ])
}

export function setStudentMaterialProgressCache(
  studentId: string,
  data: MaterialProgress[]
) {
  return queryCache.setQueryData(["studentCurriculumProgress", studentId], data)
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
