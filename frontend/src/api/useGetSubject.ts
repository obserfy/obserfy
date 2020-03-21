import { QueryState, useQuery } from "react-query"
import { fetchApi } from "./fetchApi"
import { Subject } from "./useGetAreaSubjects"

export function useGetSubject(subjectId: string): QueryState<Subject> {
  const fetchSubjectMaterials = fetchApi<Subject>(
    `/curriculum/subjects/${subjectId}`
  )
  return useQuery(["subject", subjectId], fetchSubjectMaterials)
}
