import useApi from "./useApi"

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
export function useGetStudentMaterialProgress(
  studentId: string
): [MaterialProgress[], boolean, () => void] {
  const [area, loading, setOutdated] = useApi<MaterialProgress[]>(
    `/students/${studentId}/materialsProgress`
  )
  return [area ?? [], loading, setOutdated]
}

export function materialStageToString(stage?: MaterialProgressStage): string {
  let status = ""
  switch (stage) {
    case MaterialProgressStage.MASTERED:
      status = "Mastered"
      break
    case MaterialProgressStage.PRACTICED:
      status = "Practiced"
      break
    case MaterialProgressStage.PRESENTED:
      status = "Presented"
      break
    default:
      status = ""
  }
  return status
}
