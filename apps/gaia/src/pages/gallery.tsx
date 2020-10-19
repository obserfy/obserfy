import React, { FC } from "react"
import Head from "next/head"
import Img from "react-optimized-image"
import { v4 as uuidv4 } from "uuid"
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
          <div className="w-1/3 md:w-1/5 ">
            <div className="m-3 relative">
              <div style={{ width: "100%", paddingBottom: "100%" }}>
                <label
                  htmlFor="upload-image"
                  className="absolute top-0 left-0 flex flex-col items-center justify-center font-bold text-sm border rounded w-full h-full bg-white"
                >
                  <Img src={UploadIcon} />
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
                      await postImage({ id: uuidv4(), file: e.target.files[0] })
                    }}
                  />
                </label>
              </div>
            </div>
          </div>
          {childImages.data?.map((img) => (
            <div key={img.id} className="w-1/3 md:w-1/5 relative">
              <div style={{ width: "100%", paddingBottom: "100%" }}>
                {img.isUploading && (
                  <p className="font-bold left-0 right-0 top-0 bottom-0 absolute flex items-center justify-center z-10">
                    Uploading
                  </p>
                )}
                <img
                  src={img.imageUrl}
                  alt="children activity"
                  className={`absolute w-full h-full object-cover ${
                    img.isUploading ? "opacity-25" : ""
                  }`}
                  loading="lazy"
                />
              </div>
            </div>
          ))}
          {childImages.isSuccess && childImages.data?.length === 0 && (
            <EmptyGalleryIllustration loading={childImages.isLoading} />
          )}
        </div>
      </div>
      <ImagePreview />
    </>
  )
}

const ImagePreview = () => {
  return <div>tes</div>
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
