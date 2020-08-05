import React, { FC, useState } from "react"
import { Box, Button, Flex } from "theme-ui"
import Typography from "../Typography/Typography"

import Spacer from "../Spacer/Spacer"

import LoadingPlaceholder from "../LoadingPlaceholder/LoadingPlaceholder"
import CardLink from "../CardLink/CardLink"
import BackNavigation from "../BackNavigation/BackNavigation"
import { useGetCurriculum } from "../../api/useGetCurriculum"
import { useGetCurriculumAreas } from "../../api/useGetCurriculumAreas"
import { createDefaultCurriculum } from "../../api/createDefaultCurriculum"
import { Area } from "../../api/useGetArea"
import { ReactComponent as PlusIcon } from "../../icons/plus.svg"
import Icon from "../Icon/Icon"
import NewAreaDialog from "../NewAreaDialog/NewAreaDialog"
import { CURRICULUM_AREA_URL, SETTINGS_URL } from "../../routes"

export const PageCurriculumSettings: FC = () => {
  const [showNewAreaDialog, setShowNewAreaDialog] = useState(false)

  const curriculum = useGetCurriculum()
  const areas = useGetCurriculumAreas()

  const loading = curriculum.loading || areas.status === "loading"

  function closeNewAreaDialog(): void {
    setShowNewAreaDialog(false)
  }

  return (
    <>
      <Box sx={{ maxWidth: "maxWidth.sm" }} margin="auto">
        <BackNavigation to={SETTINGS_URL} text="Settings" />
        {loading && <LoadingState />}
        {!loading && !curriculum.error && (
          <CurriculumAreas
            newAreaClick={() => setShowNewAreaDialog(true)}
            name={curriculum.data?.name}
            areas={areas.data ?? []}
          />
        )}
        {!loading && curriculum.error && (
          <SetupCurriculum
            onCreated={() => {
              curriculum.setOutdated()
              areas.refetch()
            }}
          />
        )}
      </Box>
      {showNewAreaDialog && curriculum.data && (
        <NewAreaDialog
          curriculumId={curriculum.data.id}
          onDismiss={closeNewAreaDialog}
          onSaved={() => {
            closeNewAreaDialog()
            areas.refetch()
          }}
        />
      )}
    </>
  )
}

const SetupCurriculum: FC<{ onCreated: () => void }> = ({ onCreated }) => (
  <Flex sx={{ alignItems: "center" }} p={3}>
    <Typography.H6>Setup curriculum</Typography.H6>
    <Spacer />
    <Button onClick={() => createDefaultCurriculum(onCreated)}>
      Use default
    </Button>
  </Flex>
)

const CurriculumAreas: FC<{
  newAreaClick: () => void
  name?: string
  areas?: Area[]
}> = ({ newAreaClick, name, areas }) => (
  <Box mx={3}>
    <Typography.H4 pb={3}>{name}</Typography.H4>
    <Button
      variant="outline"
      mb={2}
      sx={{ width: "100%" }}
      onClick={newAreaClick}
    >
      <Icon as={PlusIcon} mr={2} />
      New Area
    </Button>
    {areas?.map((area) => (
      <CardLink
        key={area.id}
        name={area.name}
        to={CURRICULUM_AREA_URL(area.id)}
        mb={2}
      />
    ))}
  </Box>
)

const LoadingState: FC = () => (
  <Box p={3}>
    <LoadingPlaceholder sx={{ width: "100%", height: "5rem" }} />
    <LoadingPlaceholder sx={{ width: "100%", height: "6rem" }} mt={3} />
    <LoadingPlaceholder sx={{ width: "100%", height: "6rem" }} mt={3} />
    <LoadingPlaceholder sx={{ width: "100%", height: "6rem" }} mt={3} />
  </Box>
)

export default PageCurriculumSettings
