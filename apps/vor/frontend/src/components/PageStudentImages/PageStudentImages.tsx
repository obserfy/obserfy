/** @jsx jsx */
import { FC } from "react"
import { Box, Button, Flex, Image, Input, jsx, Label } from "theme-ui"
import { Trans } from "@lingui/macro"
import {
  STUDENT_IMAGE_DETAILS_URL,
  STUDENT_OVERVIEW_PAGE_URL,
  STUDENTS_URL,
} from "../../routes"
import Typography from "../Typography/Typography"
import { useGetStudent } from "../../api/useGetStudent"
import Icon from "../Icon/Icon"
import { ReactComponent as PlusIcon } from "../../icons/plus.svg"
import usePostNewStudentImage from "../../api/students/usePostNewStudentImage"
import useGetStudentImages from "../../api/students/useGetStudentImages"
import LoadingIndicator from "../LoadingIndicator/LoadingIndicator"
import { Link } from "../Link/Link"
import BackButton from "../BackButton/BackButton"
import Breadcrumb from "../Breadcrumb/Breadcrumb"
import BreadcrumbItem from "../Breadcrumb/BreadcrumbItem"

interface Props {
  studentId: string
}
export const PageStudentImages: FC<Props> = ({ studentId }) => {
  const student = useGetStudent(studentId)
  const images = useGetStudentImages(studentId)
  const [postNewStudentImage, { isLoading }] = usePostNewStudentImage(studentId)

  return (
    <Box sx={{ maxWidth: "maxWidth.sm" }} margin="auto" pb={5}>
      <Flex sx={{ height: 48, alignItems: "center" }}>
        <BackButton to={STUDENT_OVERVIEW_PAGE_URL(studentId)} />
        <Breadcrumb>
          <BreadcrumbItem to={STUDENTS_URL}>
            <Trans>Students</Trans>
          </BreadcrumbItem>
          <BreadcrumbItem to={STUDENT_OVERVIEW_PAGE_URL(studentId)}>
            {student.data?.name.split(" ")[0]}
          </BreadcrumbItem>
          <BreadcrumbItem>
            <Trans>Image gallery</Trans>
          </BreadcrumbItem>
        </Breadcrumb>
      </Flex>
      <Typography.H5 mx={3} mt={3} color="textDisabled">
        {student.data?.name}
      </Typography.H5>
      <Typography.H5 mx={3} mb={4}>
        <Trans>Gallery</Trans>
      </Typography.H5>
      <Box px={3}>
        <Label>
          <Input
            type="file"
            accept="image/*"
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
            <Trans>Upload Photo</Trans>
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
