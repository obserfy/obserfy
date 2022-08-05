import { keyframes } from "@emotion/react"
import { Trans } from "@lingui/macro"
import { ChangeEvent, FC, Fragment, useEffect, useState } from "react"
import { Box, Button, Flex, Image, Label } from "theme-ui"
import { getFirstName } from "../../domain/person"
import { VideoStatus } from "../../domain/video"
import { useUploadStudentVideo } from "../../hooks/api/schools/useUploadStudentVideo"
import useGetStudentImages, {
  StudentImage,
} from "../../hooks/api/students/useGetStudentImages"
import useGetVideos from "../../hooks/api/students/useGetVideos"
import usePostNewStudentImage from "../../hooks/api/students/usePostNewStudentImage"
import { useGetStudent } from "../../hooks/api/useGetStudent"
import useVisibilityState from "../../hooks/useVisibilityState"
import { ReactComponent as PlusIcon } from "../../icons/plus.svg"
import {
  STUDENT_IMAGE_URL,
  STUDENT_OVERVIEW_URL,
  STUDENTS_URL,
} from "../../routes"
import Dialog from "../Dialog/Dialog"
import Icon from "../Icon/Icon"
import { Link } from "../Link/Link"
import LoadingIndicator from "../LoadingIndicator/LoadingIndicator"
import Tab from "../Tab/Tab"
import TopBar, { breadCrumb } from "../TopBar/TopBar"
import TranslucentBar from "../TranslucentBar/TranslucentBar"
import Typography from "../Typography/Typography"
import VideoPlayerDialog from "../VideoPlayerDialog/VideoPlayerDialog"

export interface PageGalleryProps {
  studentId: string
}

enum View {
  IMAGES,
  VIDEOS,
}

const PageGallery: FC<PageGalleryProps> = ({ studentId }) => {
  const student = useGetStudent(studentId)
  const [selectedView, setSelectedView] = useState(View.IMAGES)

  return (
    <Box>
      <TranslucentBar boxSx={{ position: "sticky", top: -48, zIndex: 10 }}>
        <TopBar
          breadcrumbs={[
            breadCrumb("Students", STUDENTS_URL),
            breadCrumb(
              getFirstName(student.data),
              STUDENT_OVERVIEW_URL(studentId)
            ),
            breadCrumb("Gallery"),
          ]}
        />

        <Tab
          items={["Images", "Videos"]}
          selectedItemIdx={selectedView}
          onTabClick={(idx) => setSelectedView(idx)}
        />
      </TranslucentBar>

      {selectedView === View.IMAGES && <ImagesView studentId={studentId} />}
      {selectedView === View.VIDEOS && <VideosView studentId={studentId} />}
    </Box>
  )
}

const ImagesView: FC<{ studentId: string }> = ({ studentId }) => {
  const postNewStudentImage = usePostNewStudentImage(studentId)
  const images = useGetStudentImages(studentId)

  const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const selectedImage = event.target.files?.[0]
    if (selectedImage) {
      try {
        await postNewStudentImage.mutateAsync(selectedImage)
      } catch (e) {
        Sentry.captureException(e)
      }
    }
  }

  return (
    <Box>
      <Flex>
        <Label
          px={3}
          pt={3}
          pb={[3, 2]}
          ml={[0, "auto"]}
          sx={{ width: ["100%", "auto"], display: "inline-block" }}
        >
          <input
            data-cy="upload-image"
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            disabled={postNewStudentImage.isLoading}
            onChange={handleImageUpload}
          />
          <Button
            as="div"
            disabled={postNewStudentImage.isLoading}
            sx={{ width: ["100%", "auto"] }}
          >
            {postNewStudentImage.isLoading && <LoadingIndicator />}
            <Icon as={PlusIcon} mr={2} fill="onPrimary" />
            <Trans>Upload Photo</Trans>
          </Button>
        </Label>
      </Flex>

      <Flex px={[2, 2]} sx={{ width: "100%", flexWrap: "wrap" }}>
        {images.data?.map((image) => (
          <ImageItem key={image.id} studentId={studentId} image={image} />
        ))}
      </Flex>
    </Box>
  )
}

const fading = keyframes`
  0% {
    background-color: rgba(165, 165, 165, 0.05);
  }
  50% {
    background-color: rgba(165, 165, 165, 0.2);
  }
  100% {
    background-color: rgba(165, 165, 165, 0.05);
  }
`
// TODO: These are some ugly css, might be inconsistent on some devices
//  due to the calc and decimal points, revisit later.
const ImageItem: FC<{ studentId: string; image: StudentImage }> = ({
  studentId,
  image,
}) => (
  <Box
    data-cy="image"
    p={[1, 2]}
    sx={{ width: ["33.333%", "25%", "20%", "14.285%"] }}
  >
    <Link
      to={STUDENT_IMAGE_URL(studentId, image.id)}
      sx={{ animation: `1s ease-in-out 0s infinite ${fading}` }}
    >
      <Box pt="100%" sx={{ width: "100%", position: "relative" }}>
        <Image
          loading="lazy"
          src={image.thumbnailUrl}
          sx={{
            backgroundColor: "surface",
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            cursor: "pointer",
          }}
        />
      </Box>
    </Link>
  </Box>
)

const VideosView: FC<{ studentId: string }> = ({ studentId }) => {
  const [shouldPoll, setShouldPoll] = useState(false)
  const videos = useGetVideos(studentId, shouldPoll)
  const uploadVideo = useUploadStudentVideo(studentId)

  const handleVideoUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const selectedVideo = event.target.files?.[0]
    if (selectedVideo) {
      try {
        await uploadVideo.mutateAsync(selectedVideo)
      } catch (e) {
        Sentry.captureException(e)
      }
    }
  }

  useEffect(() => {
    const imageNotReady = videos.data?.find(
      (v) => v.status !== VideoStatus.READY
    )
    if (imageNotReady) {
      setShouldPoll(true)
    } else {
      setShouldPoll(false)
    }
  }, [videos.data])

  return (
    <Fragment>
      <div>
        <Flex>
          <Label
            px={3}
            pt={3}
            pb={[3, 2]}
            ml={[0, "auto"]}
            sx={{ width: ["100%", "auto"], display: "inline-block" }}
          >
            <input
              type="file"
              accept="video/*"
              style={{ display: "none" }}
              disabled={uploadVideo.isLoading}
              onChange={handleVideoUpload}
            />
            <Button
              as="div"
              disabled={uploadVideo.isLoading}
              sx={{ width: ["100%", "auto"] }}
            >
              {uploadVideo.isLoading ? (
                <Fragment>
                  <LoadingIndicator mr={2} />
                  <Trans>Uploading</Trans>
                </Fragment>
              ) : (
                <Fragment>
                  <Icon as={PlusIcon} mr={2} fill="onPrimary" />
                  <Trans>Upload Video</Trans>
                </Fragment>
              )}
            </Button>
          </Label>
        </Flex>

        <Flex px={[2, 2]} sx={{ width: "100%", flexWrap: "wrap" }}>
          {videos.data?.map((video) => (
            <VideoItem
              key={video.id}
              status={video.status}
              videoId={video.id}
              studentId={studentId}
              thumbnailUrl={video.thumbnailUrl}
              playbackUrl={video.playbackUrl}
              originalThumbnailUrl={video.originalThumbnailUrl}
              createdAt={video.createdAt}
            />
          ))}
        </Flex>
      </div>
      {uploadVideo.isLoading && (
        <Dialog>
          <Flex p={3} sx={{ alignItems: "center" }}>
            <Typography.H6 sx={{ alignText: "center" }}>
              Uploading video
            </Typography.H6>
            <LoadingIndicator ml="auto" size={30} color="primary" />
          </Flex>
        </Dialog>
      )}
    </Fragment>
  )
}

const VideoItem: FC<{
  studentId: string
  playbackUrl: string
  thumbnailUrl: string
  originalThumbnailUrl: string
  createdAt: string
  videoId: string
  status: string
}> = ({
  createdAt,
  thumbnailUrl,
  studentId,
  playbackUrl,
  originalThumbnailUrl,
  videoId,
  status,
}) => {
  const videoDialog = useVisibilityState()

  const isReady = status === VideoStatus.READY

  return (
    <Fragment>
      <Box p={[1, 2]} sx={{ width: ["33.333%", "25%", "20%", "14.285%"] }}>
        <Box
          sx={{
            display: "block",
            animation: `1s ease-in-out 0s infinite ${fading}`,
          }}
          onClick={() => {
            if (isReady) videoDialog.show()
          }}
        >
          <Box
            pt="100%"
            sx={{
              width: "100%",
              position: "relative",
              animation: `1s ease-in-out 0s infinite ${fading}`,
            }}
          >
            {isReady ? (
              <Image
                loading="lazy"
                src={`${thumbnailUrl}`}
                sx={{
                  backgroundColor: "surface",
                  position: "absolute",
                  top: 0,
                  bottom: 0,
                  left: 0,
                  right: 0,
                  cursor: "pointer",
                }}
              />
            ) : (
              <Typography.Body
                sx={{
                  display: "flex",
                  position: "absolute",
                  top: 0,
                  bottom: 0,
                  left: 0,
                  right: 0,
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "bold",
                  color: "textDisabled",
                }}
              >
                Processing
              </Typography.Body>
            )}
          </Box>
        </Box>
      </Box>
      {videoDialog.visible && (
        <VideoPlayerDialog
          studentId={studentId}
          src={playbackUrl}
          onClose={videoDialog.hide}
          thumbnailUrl={originalThumbnailUrl}
          createdAt={createdAt}
          videoId={videoId}
        />
      )}
    </Fragment>
  )
}

export default PageGallery
