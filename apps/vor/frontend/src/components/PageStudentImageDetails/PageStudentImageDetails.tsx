import React, { FC, useState } from "react"
import { Box, Button, Flex, Image } from "theme-ui"
import BackNavigation from "../BackNavigation/BackNavigation"
import { STUDENT_IMAGES_URL } from "../../routes"
import useGetImage from "../../api/useGetImage"
import Typography from "../Typography/Typography"
import { useGetStudent } from "../../api/useGetStudent"
import AlertDialog from "../AlertDialog/AlertDialog"
import useDeleteImage from "../../api/useDeleteImage"
import { navigate } from "../Link/Link"
import dayjs from "../../dayjs"

interface Props {
  studentId: string
  imageId: string
}
export const PageStudentImageDetails: FC<Props> = ({ studentId, imageId }) => {
  const student = useGetStudent(studentId)
  const image = useGetImage(imageId)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [deleteImage, { isLoading }] = useDeleteImage(imageId)

  return (
    <>
      <Box sx={{ maxWidth: "maxWidth.sm" }} margin="auto">
        <BackNavigation
          to={STUDENT_IMAGES_URL(studentId)}
          text="Image Gallery"
        />
        <Typography.H5 m={3}>{student.data?.name}</Typography.H5>
        <Box px={[0, 3]}>
          <Image src={image.data?.originalUrl} sx={{ width: "100%" }} />
        </Box>
        {!image.isLoading && (
          <Flex sx={{ alignItems: "center" }} mx={3} my={2}>
            <Typography.Body sx={{ fontSize: 1 }}>
              Posted on {dayjs(image.data?.createdAt).format("ddd, D MMM 'YY")}
            </Typography.Body>
            <Button
              variant="outline"
              color="danger"
              ml="auto"
              onClick={() => setShowDeleteDialog(true)}
            >
              Delete
            </Button>
          </Flex>
        )}
      </Box>
      {showDeleteDialog && (
        <AlertDialog
          title="Delete image?"
          positiveText="Delete"
          body="Are you sure you want to delete this image?"
          negativeText="Cancel"
          onDismiss={() => setShowDeleteDialog(false)}
          onNegativeClick={() => setShowDeleteDialog(false)}
          loading={isLoading}
          onPositiveClick={async () => {
            const result = await deleteImage()
            if (result.ok) {
              await navigate(STUDENT_IMAGES_URL(studentId))
            }
          }}
        />
      )}
    </>
  )
}

export default PageStudentImageDetails
