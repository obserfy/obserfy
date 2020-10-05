import React, { FC } from "react"
import Head from "next/head"
import Img, { Svg } from "react-optimized-image"
import useGetChildImages from "../hooks/useGetChildImages"
import { useQueryString } from "../hooks/useQueryString"
import NoImagesIllustration from "../images/no-images-illustration.svg"
import UploadIcon from "../icons/upload.svg"
import usePostImage from "../hooks/api/usePostImage"
import useGetChild from "../hooks/api/useGetChild"

const GalleryPage = () => {
  const childId = useQueryString("childId")
  const childImages = useGetChildImages(childId)
  const child = useGetChild(childId)
  const [postImage] = usePostImage(childId, child.data?.schoolId ?? "")

  return (
    <>
      <Head>
        <title>Gallery | Obserfy for Parents</title>
      </Head>
      <div className="max-w-3xl mx-auto flex items-center">
        <div className="flex mx-auto flex-wrap w-full">
          <div className="w-1/3 md:w-1/5 p-3">
            <label
              htmlFor="upload-image"
              className="flex flex-col items-center justify-center font-bold text-sm border rounded w-full h-full bg-white p-0"
            >
              <Svg src={UploadIcon} />
              <span>
                Upload <span className="hidden md:inline">Image</span>
              </span>
              <input
                id="upload-image"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={async (e) => {
                  await postImage(e.target.files?.[0])
                }}
              />
            </label>
          </div>
          {childImages.data?.map((img) => (
            <div key={img.id} className="w-1/3 md:w-1/5">
              <img src={img.imageUrl} alt="children activity" />
            </div>
          ))}
          {childImages.isSuccess && childImages.data?.length === 0 && (
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
