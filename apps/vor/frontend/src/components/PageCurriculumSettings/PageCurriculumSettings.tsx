import { Trans } from "@lingui/macro"
import React, { FC } from "react"
import { Box, Button, Flex, ThemeUIStyleObject } from "theme-ui"
import { borderBottom, borderRight } from "../../border"
import { useGetCurriculum } from "../../hooks/api/useGetCurriculum"
import { useGetCurriculumAreas } from "../../hooks/api/useGetCurriculumAreas"
import { useQueryString } from "../../hooks/useQueryString"
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
import useImportCurriculum from "../../hooks/api/curriculum/useImportCurriculum"

export const PageCurriculumSettings: FC<{ sx?: ThemeUIStyleObject }> = ({
  sx,
}) => {
  const { data, isLoading, isError, isSuccess } = useGetCurriculum()
  const editDialog = useVisibilityState()
  const deleteDialog = useVisibilityState()

  if (isError) return <SetupCurriculum />

  return (
    <Box
      sx={{
        position: "sticky",
        top: 0,
        width: "100%",
        overflow: "auto",
        height: ["auto", "auto", "100vh"],
        maxWidth: ["100%", "100%", 280],
        pb: 5,
        ...borderRight,
        ...sx,
      }}
    >
      <TranslucentBar boxSx={{ ...borderBottom }}>
        <TopBar
          containerSx={{ display: ["flex", "flex", "none"] }}
          breadcrumbs={[
            breadCrumb("Admin", ADMIN_URL),
            breadCrumb("Curriculum"),
          ]}
        />

        {isSuccess && data && (
          <Flex px={3} py={3} sx={{ alignItems: "center" }}>
            <Typography.H6
              mr={3}
              sx={{
                lineHeight: 1.2,
                fontSize: [3, 3, 1],
              }}
            >
              {data.name}
            </Typography.H6>
            <Button
              variant="outline"
              onClick={deleteDialog.show}
              color="danger"
              px={2}
              ml="auto"
            >
              <Icon size={16} as={DeleteIcon} fill="danger" />
            </Button>
            <Button variant="outline" px={2} ml={2} onClick={editDialog.show}>
              <Icon size={16} as={EditIcon} />
            </Button>
          </Flex>
        )}
      </TranslucentBar>

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

  const areaId = useQueryString("areaId")

  return (
    <Box>
      <Typography.Body
        py={2}
        px={3}
        sx={{ fontWeight: "bold", ...borderBottom }}
      >
        <Trans>Areas</Trans>
      </Typography.Body>

      {areas.data?.map((area) => {
        const selected = areaId === area.id
        return (
          <Link key={area.id} to={CURRICULUM_AREA_URL(area.id)}>
            <Flex
              p={3}
              sx={{
                ...borderBottom,
                ...borderRight,
                borderRightColor: "textPrimary",
                borderRightWidth: 2,
                borderRightStyle: selected ? "solid" : "none",
                backgroundColor: selected ? "primaryLightest" : "background",
                color: selected ? "textPrimary" : "textMediumEmphasis",
                alignItems: "center",
                "&:hover": {
                  backgroundColor: "primaryLightest",
                },
              }}
            >
              <Typography.Body sx={{ color: "inherit" }}>
                {area.name}
              </Typography.Body>
              <Icon as={NextIcon} ml="auto" fill="currentColor" />
            </Flex>
          </Link>
        )
      })}

      <Flex
        p={3}
        sx={{ alignItems: "center", cursor: "pointer", ...borderBottom }}
        onClick={newAreaDialog.show}
      >
        <Icon as={PlusIcon} fill="textPrimary" />
        <Typography.Body ml={3} sx={{ color: "textMediumEmphasis" }}>
          <Trans>Add new area</Trans>
        </Typography.Body>
      </Flex>

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

const ImportButton: FC = () => {
  const importCurriculum = useImportCurriculum()
  const importDialog = useVisibilityState()
  const [file, setFile] = useState<File>()

  const handleImport = async () => {
    if (file) {
      try {
        const result = await importCurriculum.mutateAsync(file)
        if (result?.ok) {
          console.log("success")
        }
      } catch (e) {
        Sentry.captureException(e)
      }
    }
    importDialog.hide()
  }

  return (
    <>
      <Box p={3}>
        <Flex>
          <Input
            type="file"
            accept=".csv"
            onChange={async (e) => setFile(e.target.files?.[0])
            }
          />
          <Button onClick={importDialog.show}>
            <Trans>Import</Trans>
          </Button>
          {importDialog.visible && (
            <AlertDialog
              title={t`Import Curriculum`}
              body={t`This will import all data in csv file to a new curriculum, continue?`}
              onNegativeClick={importDialog.hide}
              onPositiveClick={handleImport}
            />
          )}
        </Flex>
      </Box>
    </>
  )
}

export default PageCurriculumSettings
