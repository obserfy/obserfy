import React, { FC } from "react"
import { Box, Button } from "theme-ui"
import { BackNavigation } from "../BackNavigation/BackNavigation"
import { STUDENT_OVERVIEW_PAGE_URL } from "../../routes"
import Typography from "../Typography/Typography"
import { useGetStudent } from "../../api/useGetStudent"
import Icon from "../Icon/Icon"
import { ReactComponent as PlusIcon } from "../../icons/plus.svg"

interface Props {
  id: string
}
export const PageGallery: FC<Props> = ({ id }) => {
  const student = useGetStudent(id)

  return (
    <Box sx={{ maxWidth: "maxWidth.sm" }} margin="auto" pb={5}>
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
        <Button sx={{ width: "100%" }}>
          <Icon as={PlusIcon} mr={2} fill="onPrimary" />
          Photo
        </Button>
      </Box>
    </Box>
  )
}

export default PageGallery
