import React, { FC, Suspense } from "react"
import { Box, Button, Flex } from "theme-ui"
import dayjs from "../../dayjs"
import { useGetStudent } from "../../hooks/api/useGetStudent"
import { ReactComponent as CloseIcon } from "../../icons/close.svg"
import { ReactComponent as TrashIcon } from "../../icons/trash.svg"
import Dialog from "../Dialog/Dialog"
import Icon from "../Icon/Icon"
import LoadingPlaceholder from "../LoadingPlaceholder/LoadingPlaceholder"
import { Typography } from "../Typography/Typography"
import LazyVideoPlayer from "../VideoPlayer/LazyVideoPlayer"

export interface VideoPlayerDialogProps {
  studentId: string
  src: string
  onClose: () => void
  thumbnailUrl: string
  createdAt: string
}
const VideoPlayerDialog: FC<VideoPlayerDialogProps> = ({
  studentId,
  onClose,
  src,
  thumbnailUrl,
  createdAt,
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
          <Suspense
            fallback={
              <LoadingPlaceholder sx={{ width: "100%", pt: "62.8571%" }} />
            }
          >
            <LazyVideoPlayer src={src} poster={thumbnailUrl} />
          </Suspense>
        </Box>

        <Box sx={{ display: ["none", "none", "block"], flex: 2 }}>
          <Flex sx={{ alignItems: "center" }}>
            <Box p={3}>
              <Typography.Body sx={{ fontWeight: "bold" }} mb={1}>
                {student.data?.name || ""}
              </Typography.Body>
              <Typography.Body sx={{ fontSize: 1 }}>
                {dayjs(createdAt).format("dddd, DD MMM YYYY")}
              </Typography.Body>
            </Box>

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

          <Button variant="outline" ml="auto" mr={3} px={2}>
            <Icon as={TrashIcon} fill="danger" />
          </Button>
        </Box>
      </Flex>
    </Dialog>
  )
}

export default VideoPlayerDialog
