import React, { FC, Suspense } from "react"
import { Box, Button, Flex } from "theme-ui"
import { useGetStudent } from "../../hooks/api/useGetStudent"
import { ReactComponent as CloseIcon } from "../../icons/close.svg"
import Dialog from "../Dialog/Dialog"
import Icon from "../Icon/Icon"
import LoadingPlaceholder from "../LoadingPlaceholder/LoadingPlaceholder"
import { Typography } from "../Typography/Typography"
import LazyVideoPlayer from "../VideoPlayer/LazyVideoPlayer"

export interface VideoPlayerDialogProps {
  studentId: string
  src: string
  onClose: () => void
}
const VideoPlayerDialog: FC<VideoPlayerDialogProps> = ({
  studentId,
  onClose,
  src,
}) => {
  const student = useGetStudent(studentId)

  return (
    <Dialog sx={{ maxWidth: ["maxWidth.sm", "maxWidth.xl"] }}>
      <Flex sx={{ alignItems: "center", display: ["flex", "flex", "none"] }}>
        <Typography.Body p={3} sx={{ fontWeight: "bold" }}>
          {student.data?.name || ""}
        </Typography.Body>
        <Button variant="secondary" ml="auto" px={2} mr={3} onClick={onClose}>
          <Icon as={CloseIcon} />
        </Button>
      </Flex>

      <Flex sx={{ height: ["100vh", "auto"], alignItems: "flex-start" }}>
        <Box sx={{ flex: 6 }}>
          <Suspense fallback={<LoadingPlaceholder sx={{ width: "100%" }} />}>
            <LazyVideoPlayer src={src} />
          </Suspense>
        </Box>

        <Box sx={{ display: ["none", "none", "block"], flex: 2 }}>
          <Flex sx={{ alignItems: "center" }}>
            <Typography.Body p={3} sx={{ fontWeight: "bold" }}>
              {student.data?.name || ""}
            </Typography.Body>
            <Button
              variant="secondary"
              ml="auto"
              px={2}
              mr={3}
              onClick={onClose}
            >
              <Icon as={CloseIcon} />
            </Button>
          </Flex>
        </Box>
      </Flex>
    </Dialog>
  )
}

export default VideoPlayerDialog
