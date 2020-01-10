import React, { FC } from "react"
import Typography from "../Typography/Typography"
import { Box } from "../Box/Box"
import Flex from "../Flex/Flex"
import Spacer from "../Spacer/Spacer"
import Button from "../Button/Button"
import { getAnalytics } from "../../analytics"
import { getSchoolId } from "../../hooks/schoolIdState"
import useApi from "../../hooks/useApi"

export const PageCurriculumSettings: FC = () => {
  const [curriculum, setCurriculumOutdated] = useApi(
    `/schools/${getSchoolId()}/curriculum`
  )

  async function createNewDefaultCurriculum(): Promise<void> {
    const baseUrl = "/api/v1"
    const response = await fetch(
      `${baseUrl}/schools/${getSchoolId()}/curriculum`,
      {
        credentials: "same-origin",
        method: "POST",
      }
    )
    setCurriculumOutdated()
    getAnalytics()?.track("Default curriculum created", {
      responseStatus: response.status,
    })
  }
  return (
    <Box maxWidth="maxWidth.sm" margin="auto">
      {!curriculum && (
        <Flex alignItems="center" p={3}>
          <Typography.H6>Setup curriculum</Typography.H6>
          <Spacer />
          <Button onClick={createNewDefaultCurriculum}>Use default</Button>
        </Flex>
      )}
    </Box>
  )
}

export default PageCurriculumSettings
