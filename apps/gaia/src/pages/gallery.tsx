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
      <div className="max-w-3xl mx-auto flex items-center">
        <div className="flex mx-auto flex-wrap">
          {childImages.data?.map((img) => (
            <div
              key={img.image_id}
              style={{ maxWidth: "33.3333%" }}
              className="w-full"
            >
              {/* TODO: replace with better alt */}
              <img
                src={img.imageUrl}
                alt="children activity"
                className="w-full"
              />
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default GalleryPage
