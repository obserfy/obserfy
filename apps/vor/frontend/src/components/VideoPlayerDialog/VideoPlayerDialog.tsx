import { Trans } from "@lingui/macro"
import { FC, Suspense, useState } from "react"
import { Box, Button, Flex } from "theme-ui"
import dayjs from "../../dayjs"
import { useGetStudent } from "../../hooks/api/useGetStudent"
import useDeleteVideo from "../../hooks/api/video/useDeleteVideo"
import { ReactComponent as CloseIcon } from "../../icons/close.svg"
import { ReactComponent as TrashIcon } from "../../icons/trash.svg"
import Dialog from "../Dialog/Dialog"
import Icon from "../Icon/Icon"
import LoadingIndicator from "../LoadingIndicator/LoadingIndicator"
import LoadingPlaceholder from "../LoadingPlaceholder/LoadingPlaceholder"
import { Typography } from "../Typography/Typography"
import LazyVideoPlayer from "../VideoPlayer/LazyVideoPlayer"

export interface VideoPlayerDialogProps {
  studentId: string
  src: string
  onClose: () => void
  thumbnailUrl: string
  createdAt: string
  videoId: string
}
const VideoPlayerDialog: FC<VideoPlayerDialogProps> = ({
  videoId,
  studentId,
  onClose,
  src,
  thumbnailUrl,
  createdAt,
}) => {
  const deleteVideo = useDeleteVideo(videoId, studentId)
  const student = useGetStudent(studentId)

  const [confirmDelete, setConfirmDelete] = useState(false)

  const handleVideoDelete = async () => {
    if (confirmDelete) {
      await deleteVideo.mutateAsync()
      if (deleteVideo.isSuccess) {
        onClose()
      }
    } else {
      setConfirmDelete(true)
    }
  }

  return (
    <Dialog
      sx={{
        maxWidth: ["maxWidth.sm", "maxWidth.xl"],
        width: "auto",
        minHeight: 200,
        minWidth: 200,
        maxHeight: "100vh",
      }}
    >
      <Flex sx={{ alignItems: "center", display: ["flex", "flex", "none"] }}>
        <Typography.Body p={3} sx={{ fontWeight: "bold" }}>
          {student.data?.name || ""}
        </Typography.Body>
        <Button variant="text" ml="auto" px={2} mr={3} onClick={onClose}>
          <Icon as={CloseIcon} />
        </Button>
      </Flex>

      <Flex sx={{ alignItems: "flex-start" }}>
        <Suspense
          fallback={
            <LoadingPlaceholder sx={{ width: "100%", pt: "62.8571%" }} />
          }
        >
          <LazyVideoPlayer
            src={src}
            poster={thumbnailUrl}
            sx={{ flex: 6, backgroundColor: "black", width: "100%" }}
          />
        </Suspense>

        <Box
          sx={{ display: ["none", "none", "block"], flex: 2, minWidth: 250 }}
        >
          <Flex sx={{ alignItems: "center" }}>
            <Box p={3}>
              <Typography.Body sx={{ fontWeight: "bold" }} mb={1}>
                {student.data?.name || ""}
              </Typography.Body>
              <Typography.Body sx={{ fontSize: 1 }}>
                {dayjs(createdAt).format("dddd, DD MMM YYYY")}
              </Typography.Body>
            </Box>

            <Button variant="text" ml="auto" px={2} mr={3} onClick={onClose}>
              <Icon as={CloseIcon} />
            </Button>
          </Flex>

          {!confirmDelete && (
            <Button
              variant="outline"
              ml="auto"
              mr={3}
              px={2}
              onClick={handleVideoDelete}
            >
              <Icon as={TrashIcon} fill="danger" />
            </Button>
          )}
          {confirmDelete && (
            <Flex>
              <Button
                ml="auto"
                variant="outline"
                onClick={() => setConfirmDelete(false)}
              >
                <Trans>Cancel</Trans>
              </Button>
              <Button
                sx={{
                  backgroundColor: "danger",
                  color: "onDanger",
                  fontWeight: "bold",
                }}
                ml={2}
                mr={3}
                onClick={handleVideoDelete}
                disabled={deleteVideo.isLoading}
              >
                {deleteVideo.isLoading ? (
                  <LoadingIndicator />
                ) : (
                  <Trans>Confirm Deletion</Trans>
                )}
              </Button>
            </Flex>
          )}
        </Box>
      </Flex>
    </Dialog>
  )
}

export default VideoPlayerDialog
