import { FC, useState } from "react"
import { Image, ThemeUIStyleObject } from "theme-ui"
import ImagePreviewOverlay from "../ImagePreviewOverlay/ImagePreviewOverlay"

export interface ImagePreviewProps {
  id: string
  originalUrl: string
  thumbnailUrl: string
  imageSx?: ThemeUIStyleObject
  studentId: string
  imageId: string
}
export const ImagePreview: FC<ImagePreviewProps> = ({
  studentId,
  thumbnailUrl,
  originalUrl,
  imageSx,
  imageId,
}) => {
  const [showOriginal, setShowOriginal] = useState(false)
  return (
    <>
      <Image
        data-cy="observation-image"
        src={thumbnailUrl}
        height={32}
        width={32}
        sx={{ ...imageSx, borderRadius: "default" }}
        onClick={() => setShowOriginal(true)}
      />
      {showOriginal && (
        <ImagePreviewOverlay
          imageId={imageId}
          studentId={studentId}
          src={originalUrl}
          onDismiss={() => setShowOriginal(false)}
        />
      )}
    </>
  )
}

export default ImagePreview
