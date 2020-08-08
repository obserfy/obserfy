import React, { FC } from "react"
import { Image, Input, Box, Button, Label, Flex } from "theme-ui"
import { BackNavigation } from "../BackNavigation/BackNavigation"
import { STUDENT_OVERVIEW_PAGE_URL } from "../../routes"
import Typography from "../Typography/Typography"
import { useGetStudent } from "../../api/useGetStudent"
import Icon from "../Icon/Icon"
import { ReactComponent as PlusIcon } from "../../icons/plus.svg"
import usePostNewStudentImage from "../../api/students/usePostNewStudentImage"
import useGetStudentImages from "../../api/students/useGetStudentImages"
import LoadingIndicator from "../LoadingIndicator/LoadingIndicator"

interface Props {
  id: string
}
export const PageGallery: FC<Props> = ({ id }) => {
  const student = useGetStudent(id)
  const images = useGetStudentImages(id)
  const [postNewStudentImage, { isLoading }] = usePostNewStudentImage(id)

  return (
    <Box sx={{ maxWidth: "maxWidth.lg" }} margin="auto" pb={5}>
      <BackNavigation
        text="Student Overview"
        to={STUDENT_OVERVIEW_PAGE_URL(id)}
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
        sx={{
          flexWrap: "wrap",
          "& :nth-child(3n)": {
            pr: 0,
          },
        }}
        mt={4}
        mx={[0, 3]}
      >
        {images.data?.map((image) => (
          <Image
            src={image.thumbnailUrl}
            sx={{ width: ["33.333%", "33.333%", "25%"] }}
            pb={[1, 3]}
            pr={[1, 3]}
          />
        ))}
      </Flex>
    </Box>
  )
}

export default PageGallery
