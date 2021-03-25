import { useQuery } from "react-query"
import { GetChildProgressResponse } from "../../pages/api/children/[childId]/progress"
import { getApi } from "./apiHelpers"

const useGetCurriculumProgress = (childId: string) => {
  const getCurriculumProgress = getApi<GetChildProgressResponse>(
    `/children/${childId}/progress`
  )

  return useQuery(["child", childId, "progress"], getCurriculumProgress)
}

export default useGetCurriculumProgress
