import useApi from "./useApi"

export enum MaterialProgressStage {
  PRESENTED,
  PRACTICED,
  MASTERED,
}
export interface StudentMaterialProgress {
  areaId: string
  materialName: string
  materialId: string
  stage: MaterialProgressStage
  lastUpdated: Date
}
export function useGetStudentMaterialProgress(
  studentId: string
): [StudentMaterialProgress[], boolean, () => void] {
  const [area, loading, setOutdated] = useApi<StudentMaterialProgress[]>(
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
