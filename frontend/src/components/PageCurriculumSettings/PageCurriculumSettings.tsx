import React, { FC } from "react"
import Typography from "../Typography/Typography"
import { Box } from "../Box/Box"
import Flex from "../Flex/Flex"
import Spacer from "../Spacer/Spacer"
import Button from "../Button/Button"
import LoadingPlaceholder from "../LoadingPlaceholder/LoadingPlaceholder"
import CardLink from "../CardLink/CardLink"
import BackNavigation from "../BackNavigation/BackNavigation"
import { useGetCurriculum } from "../../api/useGetCurriculum"
import { useGetCurriculumAreas } from "../../api/useGetCurriculumAreas"
import { createDefaultCurriculum } from "../../api/createDefaultCurriculum"
import { Area } from "../../api/useGetArea"
import { ReactComponent as PlusIcon } from "../../icons/plus.svg"
import Icon from "../Icon/Icon"

export const PageCurriculumSettings: FC = () => {
  const curriculum = useGetCurriculum()
  const areas = useGetCurriculumAreas()

  const loading = curriculum.loading || areas.loading
  const hasCurriculum = !loading && !curriculum.error

  return (
    <Box maxWidth="maxWidth.sm" margin="auto">
      <BackNavigation to="/dashboard/settings" text="Settings" />
      {loading && <LoadingState />}
      {hasCurriculum ? (
        <CurriculumOverview name={curriculum.data?.name} areas={areas.data} />
      ) : (
        <SetupCurriculum
          onCreated={() => {
            curriculum.setOutdated()
            areas.setOutdated()
          }}
        />
      )}
    </Box>
  )
}

const SetupCurriculum: FC<{ onCreated: () => void }> = ({ onCreated }) => (
  <Flex alignItems="center" p={3}>
    <Typography.H6>Setup curriculum</Typography.H6>
    <Spacer />
    <Button onClick={() => createDefaultCurriculum(onCreated)}>
      Use default
    </Button>
  </Flex>
)

const CurriculumOverview: FC<{ name?: string; areas?: Area[] }> = ({
  name,
  areas,
}) => (
  <Box mx={3}>
    <Typography.H3 pb={3}>{name}</Typography.H3>
    <Button variant="outline" mb={2} width="100%">
      <Icon as={PlusIcon} m={0} mr={2} />
      New Area
    </Button>
    {areas?.map(area => (
      <CardLink
        key={area.id}
        name={area.name}
        to={`/dashboard/settings/curriculum/area?id=${area.id}`}
        mb={2}
      />
    ))}
  </Box>
)

const LoadingState: FC = () => (
  <Box p={3}>
    <LoadingPlaceholder width="100%" height="5rem" />
    <LoadingPlaceholder width="100%" height="6rem" mt={3} />
    <LoadingPlaceholder width="100%" height="6rem" mt={3} />
    <LoadingPlaceholder width="100%" height="6rem" mt={3} />
  </Box>
)

export default PageCurriculumSettings
