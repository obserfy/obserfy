/** @jsx jsx */
import { FC } from "react"
import { Box, Button, Flex, Image, Input, jsx, Label } from "theme-ui"
import { BackNavigation } from "../BackNavigation/BackNavigation"
import {
  STUDENT_IMAGE_DETAILS_URL,
  STUDENT_OVERVIEW_PAGE_URL,
} from "../../routes"
import Typography from "../Typography/Typography"
import { useGetStudent } from "../../api/useGetStudent"
import Icon from "../Icon/Icon"
import { ReactComponent as PlusIcon } from "../../icons/plus.svg"
import usePostNewStudentImage from "../../api/students/usePostNewStudentImage"
import useGetStudentImages from "../../api/students/useGetStudentImages"
import LoadingIndicator from "../LoadingIndicator/LoadingIndicator"
import { Link } from "../Link/Link"

interface Props {
  studentId: string
}
export const PageStudentImages: FC<Props> = ({ studentId }) => {
  const student = useGetStudent(studentId)
  const images = useGetStudentImages(studentId)
  const [postNewStudentImage, { isLoading }] = usePostNewStudentImage(studentId)

  return (
    <Box sx={{ maxWidth: "maxWidth.md" }} margin="auto" pb={5}>
      <BackNavigation
        text="Student Overview"
        to={STUDENT_OVERVIEW_PAGE_URL(studentId)}
      />
      <Typography.H5 mx={3} mt={3} color="textDisabled">
        {student.data?.name}
      </Typography.H5>
      <Typography.H5 mx={3} mb={4}>
        Gallery
      </Typography.H5>
      <Box px={3}>
        <Label>
          <Input
            type="file"
            sx={{ display: "none" }}
            disabled={isLoading}
            onChange={async (e) => {
              const selectedImage = e.target.files?.[0]
              if (selectedImage) {
                await postNewStudentImage(selectedImage)
              }
            }}
          />
          <Button as="div" sx={{ width: "100%" }} disabled={isLoading}>
            {isLoading && <LoadingIndicator />}
            <Icon as={PlusIcon} mr={2} fill="onPrimary" />
            Photo
          </Button>
        </Label>
      </Box>
      <Flex
        mt={4}
        mx={[0, 3]}
        sx={{
          flexWrap: "wrap",
          "& :nth-child(3n)": { mr: [0, 0, 3] },
          "& :nth-child(4n)": { mr: [1, 1, 0] },
        }}
      >
        {images.data?.map((image) => {
          // TODO: These are some ugly css, might be inconsistent on some devices
          //  due to the calc and decimal points, revisit later.
          return (
            <Link
              to={STUDENT_IMAGE_DETAILS_URL(studentId, image.id)}
              sx={{
                mr: [1, 3],
                mb: [1, 3],
                width: [
                  "calc(33.333% - 2.6666666px)",
                  "calc(33.333% - 10.666666px)",
                  "calc(25% - 12px)",
                ],
              }}
            >
              <Box pt="100%" sx={{ width: "100%", position: "relative" }}>
                <Image
                  loading="lazy"
                  src={image.thumbnailUrl}
                  sx={{
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
          )
        })}
      </Flex>
    </Box>
  )
}

export default PageStudentImages
