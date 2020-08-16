import React from "react"
import Head from "next/head"
import useGetChildImages from "../hooks/useGetChildImages"
import { useQueryString } from "../hooks/useQueryString"

const GalleryPage = () => {
  const childId = useQueryString("childId")
  const childImages = useGetChildImages(childId)
  return (
    <>
      <Head>
        <title>Gallery | Obserfy for Parents</title>
      </Head>
      <div className="max-w-3xl mx-auto flex items-center p-3">
        <div className="grid grid-cols-3 gap-5 mx-auto">
          {childImages.data?.map((img) => (
            <div key={img.image_id}>
              <img src={img.imageUrl} />
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default GalleryPage
