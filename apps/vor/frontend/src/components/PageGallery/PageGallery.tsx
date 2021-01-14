/** @jsx jsx * */
import { keyframes } from "@emotion/react"
import { Trans } from "@lingui/macro"
import { ChangeEvent, FC } from "react"
import { Box, Button, Flex, Image, Label, jsx } from "theme-ui"
import { getFirstName } from "../../domain/person"
import useGetStudentImages, {
  StudentImage,
} from "../../hooks/api/students/useGetStudentImages"
import usePostNewStudentImage from "../../hooks/api/students/usePostNewStudentImage"
import { useGetStudent } from "../../hooks/api/useGetStudent"
import { ReactComponent as PlusIcon } from "../../icons/plus.svg"
import {
  STUDENT_IMAGE_URL,
  STUDENT_OVERVIEW_URL,
  STUDENTS_URL,
} from "../../routes"
import Icon from "../Icon/Icon"
import { Link } from "../Link/Link"
import LoadingIndicator from "../LoadingIndicator/LoadingIndicator"
import Tab from "../Tab/Tab"
import TopBar, { breadCrumb } from "../TopBar/TopBar"
import TranslucentBar from "../TranslucentBar/TranslucentBar"

export interface PageGalleryProps {
  studentId: string
}

const PageGallery: FC<PageGalleryProps> = ({ studentId }) => {
  const student = useGetStudent(studentId)

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
          items={["Photos", "Videos"]}
          selectedItemIdx={0}
          onTabClick={() => {}}
        />
      </TranslucentBar>

      <ImageView studentId={studentId} />
    </Box>
  )
}

const ImageView: FC<{ studentId: string }> = ({ studentId }) => {
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

export default PageGallery
