import { QueryResult, useQuery } from "react-query"
import { fetchApi } from "./fetchApi"
import { Subject } from "./useGetAreaSubjects"

export function useGetSubject(subjectId: string): QueryResult<Subject> {
  const fetchSubjectMaterials = fetchApi<Subject>(
    `/curriculum/subjects/${subjectId}`
  )
  return useQuery(["subject", subjectId], fetchSubjectMaterials)
}
