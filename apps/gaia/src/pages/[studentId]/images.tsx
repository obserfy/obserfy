import Image from "next/image"
import { ChangeEventHandler, FC, useState } from "react"
import { v4 as uuidv4 } from "uuid"
import { withPageAuthRequired } from "$lib/auth"
import Icon from "$components/Icon/Icon"
import ImagePreview from "$components/ImagePreview/ImagePreview"
import useGetChild from "$hooks/api/useGetChild"
import useGetChildImages, { ChildImage } from "$hooks/api/useGetChildImages"
import usePostImage from "$hooks/api/usePostImage"
import { useQueryString } from "$hooks/useQueryString"
import BaseLayout from "$layouts/BaseLayout"

const GalleryPage = () => {
  const studentId = useQueryString("studentId")
  const studentImages = useGetChildImages(studentId)
  const student = useGetChild(studentId)
  const postImage = usePostImage(studentId, student.data?.schoolId ?? "")

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
    <BaseLayout title="Images">
      <div className="mx-auto max-w-3xl">
        <div className="flex flex-wrap pr-1 w-full">
          {studentImages.isSuccess && studentImages.data?.length === 0 ? (
            <EmptyState
              isLoading={studentImages.isLoading}
              onChange={handleImageUpload}
            />
          ) : (
            <UploadImageButton onChange={handleImageUpload} />
          )}

          {studentImages.data?.map((img) => (
            <ImageItems key={img.id} img={img} childId={studentId} />
          ))}
        </div>
      </div>
    </BaseLayout>
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
        className="relative w-1/3 md:w-1/5 cursor-pointer"
        onClick={() => setShowPreview(true)}
      >
        {img.isUploading ? (
          <div style={{ width: "100%", paddingBottom: "100%" }}>
            <p className="flex absolute top-0 right-0 bottom-0 left-0 z-10 justify-center items-center font-bold">
              Uploading
            </p>
            <img
              src={img.imageUrl}
              alt="children activity"
              className="object-cover absolute w-full h-full opacity-25"
            />
          </div>
        ) : (
          <div className="w-full" style={{ paddingTop: "100%" }}>
            <Image
              src={img.originalImageUrl}
              alt="children activity"
              className="object-cover absolute m-1 md:m-2 w-full h-full bg-white"
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
  <div className="w-1/3 md:w-1/5">
    <div className="relative m-3">
      <div style={{ width: "100%", paddingBottom: "100%" }}>
        <label
          htmlFor="upload-image"
          className="flex absolute top-0 left-0 flex-col justify-center items-center w-full h-full text-sm font-bold bg-white rounded border"
        >
          <Icon src="/icons/upload.svg" className="mb-1 !w-6 !h-6" />
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
  <div className="flex flex-col items-center pb-8 mx-auto">
    <EmptyGalleryIllustration loading={isLoading} />
    <label
      className="flex items-center py-2 px-6 text-sm text-onPrimary rounded border bg-primary shadow-xs"
      htmlFor="upload-image-small"
    >
      <Icon src="/icons/upload.svg" className="mr-3" />
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
      className="mb-3 w-64 md:w-1/2"
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

export const getServerSideProps = withPageAuthRequired()

export default GalleryPage
