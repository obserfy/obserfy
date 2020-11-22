import { useQuery } from "react-query"
import { getApi } from "./apiHelpers"
import { GetChildProgressResponse } from "../../pages/api/children/[childId]/progress"

const useGetCurriculumProgress = (childId: string) => {
  const getCurriculumProgress = getApi<GetChildProgressResponse>(
    `/children/${childId}/progress`
  )

  return useQuery(["child", childId, "progress"], getCurriculumProgress)
}

export default useGetCurriculumProgress
