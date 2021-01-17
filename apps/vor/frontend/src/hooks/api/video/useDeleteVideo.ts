import { useMutation } from "react-query"
import { deleteApi } from "../fetchApi"

const useDeleteVideo = (videoId: string) => {
  const deleteVideo = deleteApi(`/videos/${videoId}`)
  return useMutation(deleteVideo)
}

export default useDeleteVideo
