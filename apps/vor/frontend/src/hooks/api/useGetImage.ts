import { useQuery } from "react-query"
import { getApi } from "./fetchApi"

interface Image {
  id: string
  url: string
  originalUrl: string
  createdAt: string
}
const useGetImage = (imageId: string) => {
  const getImage = getApi<Image>(`/images/${imageId}`)
  return useQuery(["image", imageId], getImage, { enabled: imageId !== "" })
}

export default useGetImage
