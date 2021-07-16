import PageGallery from "../../../../components/PageGallery/PageGallery"
import { useQueryString } from "../../../../hooks/useQueryString"

const GalleryPage = () => {
  const studentId = useQueryString("studentId")
  return <PageGallery studentId={studentId} />
}

export default GalleryPage
