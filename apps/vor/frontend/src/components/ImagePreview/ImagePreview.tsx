import React, { FC, useState } from "react"
import { Button, Image, SxStyleProp } from "theme-ui"
import Dialog from "../Dialog/Dialog"
import { ReactComponent as CloseIcon } from "../../icons/close.svg"
import Icon from "../Icon/Icon"

export interface ImagePreviewProps {
  id: string
  originalUrl: string
  thumbnailUrl: string
  imageSx?: SxStyleProp
}
export const ImagePreview: FC<ImagePreviewProps> = ({
  thumbnailUrl,
  originalUrl,
  imageSx,
}) => {
  const [showOriginal, setShowOriginal] = useState(false)
  return (
    <>
      <Image
        src={thumbnailUrl}
        height={32}
        width={32}
        sx={{ ...imageSx, borderRadius: "default" }}
        onClick={() => setShowOriginal(true)}
      />
      {showOriginal && (
        <Dialog
          sx={{
            overflowY: "auto",
            backgroundColor: "background",
          }}
        >
          <Button
            variant="outline"
            ml="auto"
            my={3}
            mr={3}
            p={2}
            onClick={() => setShowOriginal(false)}
          >
            <Icon as={CloseIcon} mr={1} />
            Close
          </Button>
          <Image src={originalUrl} />
        </Dialog>
      )}
    </>
  )
}

export default ImagePreview
