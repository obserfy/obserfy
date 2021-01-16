/** @jsx jsx * */
import { keyframes } from "@emotion/react"
import { Trans } from "@lingui/macro"
import { Suspense, ChangeEvent, FC, Fragment, useState } from "react"
import { Box, Button, Flex, Image, Label, jsx } from "theme-ui"
import { getFirstName } from "../../domain/person"
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
import LoadingPlaceholder from "../LoadingPlaceholder/LoadingPlaceholder"
import Tab from "../Tab/Tab"
import TopBar, { breadCrumb } from "../TopBar/TopBar"
import TranslucentBar from "../TranslucentBar/TranslucentBar"
import { Typography } from "../Typography/Typography"
import LazyVideoPlayer from "../VideoPlayer/LazyVideoPlayer"
import { ReactComponent as CloseIcon } from "../../icons/close.svg"

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
          onTabClick={(idx) => {
            setSelectedView(idx)
          }}
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
      <Label px={3} pt={3} pb={[3, 2]}>
        <input
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
  <Box p={[1, 2]} sx={{ width: ["33.333%", "25%", "20%", "14.285%"] }}>
    <Link
      to={STUDENT_IMAGE_URL(studentId, image.id)}
      sx={{
        display: "block",
        animation: `1s ease-in-out 0s infinite ${fading}`,
      }}
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
  const videos = useGetVideos(studentId)
  const postCreateUploadLink = useUploadStudentVideo(studentId)

  const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const selectedVideo = event.target.files?.[0]
    if (selectedVideo) {
      try {
        await postCreateUploadLink.mutateAsync(selectedVideo)
      } catch (e) {
        Sentry.captureException(e)
      }
    }
  }

  return (
    <div>
      <Label px={3} pt={3} pb={[3, 2]}>
        <input
          type="file"
          accept="video/*"
          style={{ display: "none" }}
          disabled={postCreateUploadLink.isLoading}
          onChange={handleImageUpload}
        />
        <Button
          as="div"
          disabled={postCreateUploadLink.isLoading}
          sx={{ width: ["100%", "auto"] }}
        >
          {postCreateUploadLink.isLoading && <LoadingIndicator />}
          <Icon as={PlusIcon} mr={2} fill="onPrimary" />
          <Trans>Upload Video</Trans>
        </Button>
      </Label>

      <Flex px={[2, 2]} sx={{ width: "100%", flexWrap: "wrap" }}>
        {videos.data?.map((video) => (
          <VideoItem
            key={video.id}
            studentId={studentId}
            thumbnailUrl={video.thumbnailUrl}
            playbackUrl={video.playbackUrl}
          />
        ))}
      </Flex>
    </div>
  )
}

const VideoItem: FC<{
  studentId: string
  playbackUrl: string
  thumbnailUrl: string
}> = ({ thumbnailUrl, studentId, playbackUrl }) => {
  const videoDialog = useVisibilityState()

  return (
    <Fragment>
      <Box p={[1, 2]} sx={{ width: ["33.333%", "25%", "20%", "14.285%"] }}>
        <Box
          sx={{
            display: "block",
            animation: `1s ease-in-out 0s infinite ${fading}`,
          }}
          onClick={videoDialog.show}
        >
          <Box
            pt="100%"
            sx={{
              width: "100%",
              position: "relative",
              animation: `1s ease-in-out 0s infinite ${fading}`,
            }}
          >
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
          </Box>
        </Box>
      </Box>
      {videoDialog.visible && (
        <VideoPlayerDialogs
          studentId={studentId}
          src={playbackUrl}
          onClose={videoDialog.hide}
        />
      )}
    </Fragment>
  )
}

const VideoPlayerDialogs: FC<{
  studentId: string
  src: string
  onClose: () => void
}> = ({ src, studentId, onClose }) => {
  const student = useGetStudent(studentId)

  return (
    <Dialog sx={{ maxWidth: ["maxWidth.sm", "maxWidth.lg"] }}>
      <Flex sx={{ alignItems: "center" }}>
        <Typography.Body p={3} sx={{ fontWeight: "bold" }}>
          {student.data?.name || ""}
        </Typography.Body>
        <Button variant="secondary" ml="auto" px={2} mr={3} onClick={onClose}>
          <Icon as={CloseIcon} />
        </Button>
      </Flex>
      <Box sx={{ height: ["100vh", "auto"] }}>
        <Suspense
          fallback={
            <LoadingPlaceholder sx={{ width: "100%", pt: [0, "42.8571%"] }} />
          }
        >
          <LazyVideoPlayer src={src} />
        </Suspense>
      </Box>
    </Dialog>
  )
}

export default PageGallery
