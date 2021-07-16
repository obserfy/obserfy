import { withPageAuthRequired } from "@auth0/nextjs-auth0"
import Head from "next/head"
import Image from "next/image"
import { ChangeEventHandler, FC, useState } from "react"
import { v4 as uuidv4 } from "uuid"
import Icon from "../components/Icon/Icon"
import ImagePreview from "../components/ImagePreview/ImagePreview"
import useGetChild from "../hooks/api/useGetChild"
import useGetChildImages, { ChildImage } from "../hooks/api/useGetChildImages"
import usePostImage from "../hooks/api/usePostImage"
import { useQueryString } from "../hooks/useQueryString"
import UploadIcon from "../icons/upload.svg"

const GalleryPage = () => {
  const childId = useQueryString("childId")
  const childImages = useGetChildImages(childId)
  const child = useGetChild(childId)
  const postImage = usePostImage(childId, child.data?.schoolId ?? "")

  const handleImageUpload: ChangeEventHandler<HTMLInputElement> = async (e) => {
    if (!e.target.files?.length) {
      return
    }
    await postImage.mutate({
      id: uuidv4(),
      file: e.target.files[0],
    })
  }

  return (
    <>
      <Head>
        <title>Images | Obserfy for Parents</title>
      </Head>

      <div className="max-w-3xl mx-auto">
        <div className="flex flex-wrap w-full pr-1">
          {childImages.isSuccess && childImages.data?.length === 0 ? (
            <EmptyState
              isLoading={childImages.isLoading}
              onChange={handleImageUpload}
            />
          ) : (
            <UploadImageButton onChange={handleImageUpload} />
          )}

          {childImages.data?.map((img) => (
            <ImageItems key={img.id} img={img} childId={childId} />
          ))}
        </div>
      </div>
    </>
  )
}

const ImageItems: FC<{ childId: string; img: ChildImage }> = ({
  img,
  childId,
}) => {
  const [showPreview, setShowPreview] = useState(false)

  return (
    <>
      <button
        data-cy="image"
        className="w-1/3 md:w-1/5 relative cursor-pointer"
        onClick={() => setShowPreview(true)}
      >
        {img.isUploading ? (
          <div style={{ width: "100%", paddingBottom: "100%" }}>
            <p className=" font-bold left-0 right-0 top-0 bottom-0 absolute flex items-center justify-center z-10 ">
              Uploading
            </p>
            <img
              src={img.imageUrl}
              alt="children activity"
              className="absolute w-full h-full object-cover opacity-25"
            />
          </div>
        ) : (
          <div className="w-full" style={{ paddingTop: "100%" }}>
            <Image
              src={img.originalImageUrl}
              alt="children activity"
              className="absolute w-full h-full object-cover bg-white m-1 md:m-2"
              loading="lazy"
              layout="fill"
            />
          </div>
        )}
      </button>

      {showPreview && (
        <ImagePreview
          childId={childId}
          img={img}
          onDismiss={() => setShowPreview(false)}
        />
      )}
    </>
  )
}

const UploadImageButton: FC<{
  onChange: ChangeEventHandler<HTMLInputElement>
}> = ({ onChange }) => (
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
            onChange={onChange}
          />
        </label>
      </div>
    </div>
  </div>
)

const EmptyState: FC<{
  isLoading: boolean
  onChange: ChangeEventHandler<HTMLInputElement>
}> = ({ isLoading, onChange }) => (
  <div className="flex flex-col mx-auto items-center pb-8">
    <EmptyGalleryIllustration loading={isLoading} />
    <label
      className="flex py-2 px-6 rounded text-onPrimary bg-primary text-sm border shadow-xs items-center"
      htmlFor="upload-image-small"
    >
      <UploadIcon className="mr-3" />
      Upload Image
      <input
        id="upload-image-small"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onChange}
      />
    </label>
  </div>
)

const EmptyGalleryIllustration: FC<{ loading: boolean }> = ({ loading }) => (
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

export default withPageAuthRequired(GalleryPage)
