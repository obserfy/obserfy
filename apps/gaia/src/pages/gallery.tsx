import React, { FC, useState } from "react"
import Head from "next/head"
import { v4 as uuidv4 } from "uuid"
import Image from "next/image"
import useGetChildImages, { ChildImage } from "../hooks/api/useGetChildImages"
import { useQueryString } from "../hooks/useQueryString"
import usePostImage from "../hooks/api/usePostImage"
import useGetChild from "../hooks/api/useGetChild"
import Icon from "../components/Icon/Icon"
import ImagePreview from "../components/ImagePreview/ImagePreview"

const GalleryPage = () => {
  const childId = useQueryString("childId")
  const childImages = useGetChildImages(childId)
  const child = useGetChild(childId)
  const [postImage] = usePostImage(childId, child.data?.schoolId ?? "")
  const [imagePreview, setImagePreview] = useState<ChildImage>()

  return (
    <>
      <Head>
        <title>Gallery | Obserfy for Parents</title>
      </Head>
      <div className="max-w-3xl mx-auto">
        <div className="flex mx-auto flex-wrap w-full">
          {childImages.isSuccess && childImages.data?.length === 0 ? (
            <div className="flex flex-col mx-auto items-center pb-8">
              <EmptyGalleryIllustration loading={childImages.isLoading} />
              <label
                className="flex py-2 px-6 rounded text-onPrimary bg-primary text-sm border shadow-xs"
                htmlFor="upload-image-small"
              >
                <Icon src="/icons/upload.svg" className="mr-3" size={20} />
                Upload Image
                <input
                  id="upload-image-small"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={async (e) => {
                    if (!e.target.files?.length) {
                      return
                    }
                    await postImage({
                      id: uuidv4(),
                      file: e.target.files[0],
                    })
                  }}
                />
              </label>
            </div>
          ) : (
            <div className="w-1/3 md:w-1/5 ">
              <div className="m-3 relative">
                <div style={{ width: "100%", paddingBottom: "100%" }}>
                  <label
                    htmlFor="upload-image"
                    className="absolute top-0 left-0 flex flex-col items-center justify-center font-bold text-sm border rounded w-full h-full bg-white"
                  >
                    <Icon src="/icons/upload.svg" size={20} />
                    <span>
                      Upload <span className="hidden md:inline">Image</span>
                    </span>
                    <input
                      id="upload-image"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        if (!e.target.files?.length) {
                          return
                        }
                        await postImage({
                          id: uuidv4(),
                          file: e.target.files[0],
                        })
                      }}
                    />
                  </label>
                </div>
              </div>
            </div>
          )}
          {childImages.data?.map((img) => (
            <button
              key={img.id}
              className="w-1/3 md:w-1/5 relative cursor-pointer"
              onClick={() => setImagePreview(img)}
            >
              {img.isUploading ? (
                <div style={{ width: "100%", paddingBottom: "100%" }}>
                  <p
                    className="
                      font-bold
                      left-0 right-0 top-0 bottom-0
                      absolute
                      flex items-center justify-center
                      z-10
                    "
                  >
                    Uploading
                  </p>
                  <img
                    src={img.imageUrl}
                    alt="children activity"
                    className="absolute w-full h-full object-cover opacity-25"
                  />
                </div>
              ) : (
                <Image
                  src={img.originalImageUrl}
                  alt="children activity"
                  className="absolute w-full h-full object-cover border border-white"
                  height={250}
                  width={250}
                  loading="lazy"
                />
              )}
            </button>
          ))}
        </div>
      </div>
      {imagePreview && (
        <ImagePreview
          childId={childId}
          img={imagePreview}
          onDismiss={() => setImagePreview(undefined)}
        />
      )}
    </>
  )
}

const EmptyGalleryIllustration: FC<{ loading: boolean }> = ({ loading }) => {
  return (
    <div
      className={`flex flex-col items-center pt-16 pb-8 ${
        loading && "opacity-50"
      } transition-opacity duration-200 max-w-3xl mx-auto`}
    >
      <Image
        src="/images/no-images-illustration.svg"
        className="w-64 md:w-1/2 mb-3"
        height={200}
        width={200}
      />
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
