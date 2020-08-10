import React from "react"
import PageGallery from "../../../components/PageGallery/PageGallery"
import { useQueryString } from "../../../hooks/useQueryString"

const GalleryPage = () => {
  const id = useQueryString("id")
  return <PageGallery id={id} />
}

export default GalleryPage
