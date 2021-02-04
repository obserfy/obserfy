import { Trans } from "@lingui/macro"
import React, { FC } from "react"
import { Box, Button, Flex } from "theme-ui"
import { borderBottom, borderRight } from "../../border"
import { useGetCurriculum } from "../../hooks/api/useGetCurriculum"
import { useGetCurriculumAreas } from "../../hooks/api/useGetCurriculumAreas"
import useVisibilityState from "../../hooks/useVisibilityState"
import { ReactComponent as EditIcon } from "../../icons/edit.svg"
import { ReactComponent as NextIcon } from "../../icons/next-arrow.svg"
import { ReactComponent as PlusIcon } from "../../icons/plus.svg"
import { ReactComponent as DeleteIcon } from "../../icons/trash.svg"
import { ADMIN_URL, CURRICULUM_AREA_URL } from "../../routes"
import DeleteCurriculumDialog from "../DeleteCurriculumDialog/DeleteCurriculumDialog"
import EditCurriculumDialog from "../EditCurriculumDialog/EditCurriculumDialog"
import Icon from "../Icon/Icon"
import { Link } from "../Link/Link"
import LoadingPlaceholder from "../LoadingPlaceholder/LoadingPlaceholder"
import NewAreaDialog from "../NewAreaDialog/NewAreaDialog"
import TopBar, { breadCrumb } from "../TopBar/TopBar"
import TranslucentBar from "../TranslucentBar/TranslucentBar"
import Typography from "../Typography/Typography"
import SetupCurriculum from "./SetupCurriculum"

export const PageCurriculumSettings: FC = () => {
  const { data, isLoading, isError, isSuccess } = useGetCurriculum()
  const editDialog = useVisibilityState()
  const deleteDialog = useVisibilityState()

  return (
    <Box
      sx={{
        minHeight: "100vh",
        maxWidth: ["100%", "100%", 320],
        ...borderRight,
      }}
    >
      <TranslucentBar boxSx={{ ...borderBottom, position: "sticky", top: 0 }}>
        <TopBar
          breadcrumbs={[
            breadCrumb("Admin", ADMIN_URL),
            breadCrumb("Curriculum"),
          ]}
        />
        {isSuccess && data && (
          <Flex px={3} pb={3} sx={{ alignItems: "center" }}>
            <Typography.H5 sx={{ lineHeight: 1.2 }}>{data.name}</Typography.H5>
            <Button
              variant="outline"
              onClick={deleteDialog.show}
              color="danger"
              px={2}
              ml="auto"
            >
              <Icon as={DeleteIcon} fill="danger" />
            </Button>
            <Button variant="outline" px={2} ml={2} onClick={editDialog.show}>
              <Icon as={EditIcon} />
            </Button>
          </Flex>
        )}
      </TranslucentBar>

      {isError && <SetupCurriculum />}

      {isLoading && <LoadingState />}

      {isSuccess && data && (
        <CurriculumAreas curriculumName={data.name} curriculumId={data.id} />
      )}

      {data && deleteDialog.visible && (
        <DeleteCurriculumDialog
          onDismiss={deleteDialog.hide}
          name={data.name}
        />
      )}

      {data && editDialog.visible && (
        <EditCurriculumDialog
          curriculumId={data.id}
          onDismiss={editDialog.hide}
          originalValue={data.name}
        />
      )}
    </Box>
  )
}

const CurriculumAreas: FC<{
  curriculumId: string
  curriculumName: string
}> = ({ curriculumId }) => {
  const newAreaDialog = useVisibilityState()
  const areas = useGetCurriculumAreas()

  return (
    <Box>
      <Flex p={3} sx={{ alignItems: "center", ...borderBottom }}>
        <Typography.H6>
          <Trans>Areas</Trans>
        </Typography.H6>
        <Button ml="auto" variant="outline" onClick={newAreaDialog.show} px={2}>
          <Icon as={PlusIcon} />
        </Button>
      </Flex>

      {areas.data?.map((area) => (
        <Link
          key={area.id}
          to={CURRICULUM_AREA_URL(area.id)}
          sx={{ display: "block" }}
        >
          <Flex p={3} sx={{ alignItems: "center", ...borderBottom }}>
            <Typography.Body>{area.name}</Typography.Body>
            <Icon as={NextIcon} ml="auto" />
          </Flex>
        </Link>
      ))}

      {newAreaDialog.visible && (
        <NewAreaDialog
          curriculumId={curriculumId}
          onDismiss={newAreaDialog.hide}
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
