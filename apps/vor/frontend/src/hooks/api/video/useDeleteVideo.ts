import { useMutation } from "react-query"
import { deleteApi } from "../fetchApi"
import { useGetStudentVideosCache } from "../students/useGetVideos"

const useDeleteVideo = (videoId: string, studentId: string) => {
  const cache = useGetStudentVideosCache(studentId)
  const deleteVideo = deleteApi(`/videos/${videoId}`)

  return useMutation(deleteVideo, {
    onSuccess: () => {
      const oldData = cache.getData()
      const newData = oldData?.filter(({ id }) => {
        return id !== videoId
      })
      cache.setData(newData ?? [])
    },
  })
}

export default useDeleteVideo
