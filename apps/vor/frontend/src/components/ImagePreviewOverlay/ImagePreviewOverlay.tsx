import React, { FC, useEffect, useRef, useState } from "react"
import { Box, Button, Flex, Image } from "theme-ui"
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock"
import { useGetStudent } from "../../api/useGetStudent"
import Portal from "../Portal/Portal"
import Icon from "../Icon/Icon"
import { ReactComponent as CloseIcon } from "../../icons/close.svg"
import TranslucentBar from "../TranslucentBar/TranslucentBar"
import Typography from "../Typography/Typography"
import { ReactComponent as TrashIcon } from "../../icons/trash.svg"
import useDeleteImage from "../../api/useDeleteImage"
import LoadingIndicator from "../LoadingIndicator/LoadingIndicator"

export interface ImagePreviewOverlayProps {
  imageId: string
  studentId: string
  src: string
  onDismiss: () => void
  onDeleted?: () => void
}
const ImagePreviewOverlay: FC<ImagePreviewOverlayProps> = ({
  imageId,
  studentId,
  src,
  onDismiss,
  onDeleted,
}) => {
  const [deleteImage, { isLoading }] = useDeleteImage(studentId, imageId)
  const ref = useRef<HTMLDivElement>(null)
  const student = useGetStudent(studentId)
  const [hideUI, setHideUI] = useState(false)

  useEffect(() => {
    if (ref.current) {
      disableBodyScroll(ref.current, { reserveScrollBarGap: true })
    }
    return () => {
      if (ref.current) enableBodyScroll(ref.current)
    }
  }, [])

  return (
    <Portal>
      <Box
        sx={{
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "overlay",
          position: "fixed",
          zIndex: 1000001,
        }}
      />
      <Box
        onClick={onDismiss}
        sx={{
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          position: "fixed",
          zIndex: 1000003,
        }}
      >
        <Button
          onClick={onDismiss}
          variant="secondary"
          sx={{
            position: "absolute",
            right: 0,
            top: 0,
            zIndex: 1000013,
            backgroundColor: "overlay",
            opacity: hideUI ? 0 : 1,
            transition: "opacity 0.15s ease-in-out",
          }}
          m={3}
          p={2}
        >
          <Icon size={24} as={CloseIcon} fill="onOverlay" />
        </Button>
        <Flex
          mx="auto"
          py={[0, 4]}
          sx={{
            maxWidth: "maxWidth.md",
            height: "100%",
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box
            ref={ref}
            onClick={(e) => e.stopPropagation()}
            sx={{
              maxHeight: "100%",
              width: "100%",
              overflowY: "auto",
              position: "relative",
            }}
          >
            <Image width="100%" src={src} onClick={() => setHideUI(!hideUI)} />
            <TranslucentBar
              boxSx={{
                mt: -53,
                position: "sticky",
                bottom: 0,
                zIndex: 1000013,
                opacity: hideUI ? 0 : 1,
                transition: "opacity 0.15s ease-in-out",
              }}
            >
              <Flex sx={{ alignItems: "center" }}>
                <Typography.Body m={3}>{student.data?.name}</Typography.Body>
                <Button
                  variant="outline"
                  p={2}
                  ml="auto"
                  mr={3}
                  onClick={async () => {
                    const result = await deleteImage()
                    if (result?.ok) {
                      onDeleted()
                      onDismiss()
                    }
                  }}
                >
                  <Icon as={TrashIcon} fill="danger" />
                  {isLoading && <LoadingIndicator color="onSurface" />}
                </Button>
              </Flex>
            </TranslucentBar>
          </Box>
        </Flex>
      </Box>
    </Portal>
  )
}

export default ImagePreviewOverlay
