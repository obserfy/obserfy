import React, { FC, useState } from "react"
import { Box, Button, Flex, Image } from "theme-ui"
import BackNavigation from "../BackNavigation/BackNavigation"
import { STUDENT_IMAGES_URL } from "../../routes"
import useGetImage from "../../api/useGetImage"
import Typography from "../Typography/Typography"
import { useGetStudent } from "../../api/useGetStudent"
import { usePatchStudentApi } from "../../api/students/usePatchStudentApi"
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
  const [showSetProfileDialog, setShowSetProfileDialog] = useState(false)
  const [deleteImage, { isLoading }] = useDeleteImage(studentId, imageId)
  const [updateStudentImage, { status }] = usePatchStudentApi(studentId)

  return (
    <>
      <Box sx={{ maxWidth: "maxWidth.md" }} margin="auto">
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
            <Flex ml="auto">
              <Button
                variant="primary"
                mr={2}
                onClick={() => setShowSetProfileDialog(true)}
              >
                Set as Profile
              </Button>
              <Button
                variant="outline"
                color="danger"
                onClick={() => setShowDeleteDialog(true)}
              >
                Delete
              </Button>
            </Flex>
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

      {showSetProfileDialog && (
        <AlertDialog
          title="Set as profile?"
          positiveText="Yes"
          body="Are you sure you want to set this image as profile picture?"
          negativeText="Cancel"
          onDismiss={() => setShowSetProfileDialog(false)}
          onNegativeClick={() => setShowSetProfileDialog(false)}
          loading={status === "loading"}
          onPositiveClick={async () => {
            await updateStudentImage({
              id: studentId,
              profileImageId: imageId,
            })
            setShowSetProfileDialog(false)
          }}
        />
      )}
    </>
  )
}

export default PageStudentImageDetails
