import React, { FC } from "react"
import Typography from "../Typography/Typography"
import { Box } from "../Box/Box"
import Flex from "../Flex/Flex"
import Spacer from "../Spacer/Spacer"
import Button from "../Button/Button"
import { getAnalytics } from "../../analytics"
import { getSchoolId } from "../../hooks/schoolIdState"
import useApi from "../../api/useApi"
import LoadingPlaceholder from "../LoadingPlaceholder/LoadingPlaceholder"
import CardLink from "../CardLink/CardLink"

export const PageCurriculumSettings: FC = () => {
  const [curriculum, setCurriculumOutdated, loading] = useApi(
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
    if (response.status === 201) {
      setCurriculumOutdated()
      getAnalytics()?.track("Default curriculum created", {
        responseStatus: response.status,
      })
    } else {
      getAnalytics()?.track("Create curriculum failed", response.text())
    }
  }

  const setupCurriculum = !loading && curriculum?.error && (
    <Flex alignItems="center" p={3}>
      <Typography.H6>Setup curriculum</Typography.H6>
      <Spacer />
      <Button onClick={createNewDefaultCurriculum}>Use default</Button>
    </Flex>
  )

  const curriculumList = curriculum && curriculum.error === undefined && (
    <Box m={3}>
      <Typography.H3 py={3}>{curriculum.name}</Typography.H3>
      {curriculum.areas.map((area: any) => (
        <CardLink
          name={area.name}
          to={`/dashboard/settings/curriculum/area?id=${area.id}`}
          mb={3}
        />
      ))}
    </Box>
  )

  return (
    <Box maxWidth="maxWidth.sm" margin="auto">
      {loading && <LoadingState />}
      {setupCurriculum}
      {curriculumList}
    </Box>
  )
}

const LoadingState: FC = () => (
  <Box p={3}>
    <LoadingPlaceholder width="100%" height="5rem" />
    <LoadingPlaceholder width="100%" height="6rem" mt={3} />
    <LoadingPlaceholder width="100%" height="6rem" mt={3} />
    <LoadingPlaceholder width="100%" height="6rem" mt={3} />
  </Box>
)

export default PageCurriculumSettings
