import { QueryOptions, QueryResult, useQuery } from "react-query"
import { getApi } from "./fetchApi"
import { Subject } from "./useGetAreaSubjects"

export function useGetSubject(
  subjectId: string,
  option: QueryOptions<Subject>
): QueryResult<Subject> {
  const fetchSubjectMaterials = getApi<Subject>(
    `/curriculums/subjects/${subjectId}`
  )
  return useQuery(["subject", subjectId], fetchSubjectMaterials, option)
}
