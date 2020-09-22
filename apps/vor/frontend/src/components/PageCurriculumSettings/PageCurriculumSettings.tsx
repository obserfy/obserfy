import React, { FC, useState } from "react"
import { Box, Button, Flex } from "theme-ui"
import Typography from "../Typography/Typography"
import LoadingPlaceholder from "../LoadingPlaceholder/LoadingPlaceholder"
import CardLink from "../CardLink/CardLink"
import { useGetCurriculum } from "../../api/useGetCurriculum"
import { useGetCurriculumAreas } from "../../api/useGetCurriculumAreas"
import { ReactComponent as PlusIcon } from "../../icons/plus.svg"
import Icon from "../Icon/Icon"
import NewAreaDialog from "../NewAreaDialog/NewAreaDialog"
import { ADMIN_URL, CURRICULUM_AREA_URL } from "../../routes"
import TopBar from "../TopBar/TopBar"
import usePostCreateDefaultCurriculum from "../../api/curriculum/usePostCreateDefaultCurriculum"

export const PageCurriculumSettings: FC = () => {
  const { data, isLoading, isError } = useGetCurriculum()

  return (
    <>
      <Box sx={{ maxWidth: "maxWidth.sm" }} margin="auto">
        <TopBar
          breadcrumbs={[
            {
              text: "Admin",
              to: ADMIN_URL,
            },
            {
              text: "Curriculum",
            },
          ]}
        />
        {isLoading && <LoadingState />}
        <Typography.H4 p={3}>{data?.name}</Typography.H4>
        {!isLoading && data && <CurriculumAreas curriculum={data} />}
        {!isLoading && isError && <SetupCurriculum />}
      </Box>
    </>
  )
}

const SetupCurriculum: FC = () => {
  const [createDefaultCurriculum] = usePostCreateDefaultCurriculum()

  return (
    <Flex sx={{ alignItems: "center" }} p={3}>
      <Typography.H6>Setup curriculum</Typography.H6>
      <Button ml="auto" onClick={async () => createDefaultCurriculum()}>
        Use default
      </Button>
    </Flex>
  )
}

const CurriculumAreas: FC<{
  curriculum: { id: string }
}> = ({ curriculum }) => {
  const [showNewAreaDialog, setShowNewAreaDialog] = useState(false)
  const areas = useGetCurriculumAreas()

  return (
    <Box mx={3}>
      <Flex mb={2} sx={{ alignItems: "center" }}>
        <Typography.H6>Areas</Typography.H6>
        <Button
          ml="auto"
          variant="outline"
          onClick={() => setShowNewAreaDialog(true)}
        >
          <Icon as={PlusIcon} mr={2} />
          New Area
        </Button>
      </Flex>
      {areas.data?.map((area) => (
        <CardLink
          key={area.id}
          name={area.name}
          to={CURRICULUM_AREA_URL(area.id)}
          mb={2}
        />
      ))}
      {showNewAreaDialog && (
        <NewAreaDialog
          curriculumId={curriculum.id}
          onDismiss={() => setShowNewAreaDialog(false)}
          onSaved={() => {
            setShowNewAreaDialog(false)
            areas.refetch()
          }}
        />
      )}
    </Box>
  )
}

const LoadingState: FC = () => (
  <Box p={3}>
    <LoadingPlaceholder sx={{ width: "100%", height: "5rem" }} />
    <LoadingPlaceholder sx={{ width: "100%", height: "6rem" }} mt={3} />
    <LoadingPlaceholder sx={{ width: "100%", height: "6rem" }} mt={3} />
    <LoadingPlaceholder sx={{ width: "100%", height: "6rem" }} mt={3} />
  </Box>
)

export default PageCurriculumSettings
