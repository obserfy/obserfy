import React, { FC } from "react"
import Head from "next/head"
import Img from "react-optimized-image"
import useGetChildImages from "../hooks/useGetChildImages"
import { useQueryString } from "../hooks/useQueryString"
import NoImagesIllustration from "../images/no-images-illustration.svg"

const GalleryPage = () => {
  const childId = useQueryString("childId")
  const childImages = useGetChildImages(childId)
  return (
    <>
      <Head>
        <title>Gallery | Obserfy for Parents</title>
      </Head>
      <div className="max-w-3xl mx-auto flex items-center ">
        <div className="flex mx-auto flex-wrap w-full">
          {childImages.data.map((img) => (
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
          {childImages.data.length === 0 && (
            <EmptyGalleryIllustration loading={childImages.isLoading} />
          )}
        </div>
      </div>
    </>
  )
}

const EmptyGalleryIllustration: FC<{ loading: boolean }> = ({ loading }) => {
  return (
    <div
      className={`flex flex-col items-center py-16 ${
        loading && "opacity-50"
      } transition-opacity duration-200 max-w-3xl mx-auto`}
    >
      <Img src={NoImagesIllustration} className="w-64 md:w-1/2 mb-3" />
      <h6
        className={`text-xl mx-4 text-center ${
          loading && "opacity-0"
        } transition-opacity duration-200 font-bold`}
      >
        No images yet
      </h6>
    </div>
  )
}

export default GalleryPage
