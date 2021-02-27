/** @jsx jsx */
import { t, Trans } from "@lingui/macro"
import { FC, Fragment, useState } from "react"
import { jsx, Box, Button, Card, Flex } from "theme-ui"
import { borderBottom } from "../../border"
import { isEmpty } from "../../domain/array"
import { useGetCurriculumAreas } from "../../hooks/api/useGetCurriculumAreas"
import {
  MaterialProgress,
  Assessment,
  useGetStudentMaterialProgress,
} from "../../hooks/api/useGetStudentMaterialProgress"
import useVisibilityState from "../../hooks/useVisibilityState"
import { ADMIN_CURRICULUM_URL, STUDENT_PROGRESS_URL } from "../../routes"
import Dialog from "../Dialog/Dialog"
import DialogHeader from "../DialogHeader/DialogHeader"
import InformationalCard from "../InformationalCard/InformationalCard"
import { Link } from "../Link/Link"
import LoadingPlaceholder from "../LoadingPlaceholder/LoadingPlaceholder"
import StudentMaterialProgressDialog from "../StudentMaterialProgressDialog/StudentMaterialProgressDialog"
import Tab from "../Tab/Tab"
import Typography from "../Typography/Typography"
import MaterialProgressItem from "./MaterialProgressItem"

interface Props {
  studentId: string
}

export const AssessmentCard: FC<Props> = ({ studentId }) => {
  const [tab, setTab] = useState(0)
  const [isEditing, setIsEditing] = useState(false)
  const [selected, setSelected] = useState<MaterialProgress>()
  const areas = useGetCurriculumAreas()
  const progress = useGetStudentMaterialProgress(studentId)
  const isLoading = areas.isLoading || progress.isLoading
  const exportDialog = useVisibilityState()

  const handleItemClick = (item: MaterialProgress) => {
    setSelected(item)
    setIsEditing(true)
  }

  // Derived state
  const areaId = areas.data?.[tab]?.id
  const inSelectedArea = progress.data?.filter((p) => p.areaId === areaId)
  const inProgress = inSelectedArea?.filter(
    ({ stage }) => stage >= Assessment.PRESENTED && stage < Assessment.MASTERED
  )
  const mastered = inSelectedArea
    ?.filter(({ stage }) => stage === Assessment.MASTERED)
    ?.slice(0, 3)
    ?.sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt))

  if (isLoading) return <LoadingState />

  if (!isLoading && isEmpty(areas.data)) return <DisabledState />

  return (
    <Fragment>
      <Card variant="responsive" sx={{ overflow: "inherit" }} mt={3}>
        <Flex sx={{ alignItems: "center" }} p={3} pb={2}>
          <Typography.H6>
            <Trans>Curriculum Progress</Trans>
          </Typography.H6>

          <Button variant="secondary" ml="auto" onClick={exportDialog.show}>
            Export
          </Button>
        </Flex>

        <Tab
          small
          items={areas.data?.map(({ name }) => name) ?? []}
          onTabClick={setTab}
          selectedItemIdx={tab}
        />

        <Box my={2}>
          {isEmpty(inProgress) && <EmptyState />}

          {!isEmpty(inProgress) && <Heading text={t`In Progress`} />}
          {inProgress?.map((item) => (
            <MaterialProgressItem
              key={item.materialId}
              value={item}
              onClick={() => handleItemClick(item)}
            />
          ))}

          {!isEmpty(mastered) && <Heading text={t`Recently Mastered`} />}
          {mastered?.map((item) => (
            <MaterialProgressItem
              key={item.materialId}
              value={item}
              onClick={() => handleItemClick(item)}
            />
          ))}
        </Box>

        <Flex p={2}>
          <Link
            to={STUDENT_PROGRESS_URL(studentId, areaId ?? "")}
            sx={{ ml: "auto" }}
          >
            <Button variant="secondary">
              <Trans>See All {areas.data?.[tab]?.name} Progress</Trans>
            </Button>
          </Link>
        </Flex>
      </Card>

      {isEditing && selected && (
        <StudentMaterialProgressDialog
          studentId={studentId}
          lastUpdated={selected.updatedAt}
          stage={selected.stage}
          materialName={selected.materialName}
          materialId={selected.materialId}
          onDismiss={() => setIsEditing(false)}
        />
      )}

      {exportDialog.visible && (
        <ExportProgressDialog onDismiss={exportDialog.hide} />
      )}
    </Fragment>
  )
}

const LoadingState = () => (
  <Card variant="responsive" mt={3}>
    <Typography.H6 p={3}>
      <Trans>Curriculum Progress</Trans>
    </Typography.H6>
    <Flex px={3} pb={3} sx={{ ...borderBottom }}>
      <LoadingPlaceholder sx={{ height: "1.5rem", width: "4rem" }} mr={2} />
      <LoadingPlaceholder sx={{ height: "1.5rem", width: "4rem" }} mr={2} />
      <LoadingPlaceholder sx={{ height: "1.5rem", width: "4rem" }} mr={2} />
      <LoadingPlaceholder sx={{ height: "1.5rem", width: "4rem" }} mr={2} />
    </Flex>

    <Box p={3}>
      <Flex mb={3}>
        <LoadingPlaceholder sx={{ height: "1.5rem", width: "10rem" }} mr={2} />
        <LoadingPlaceholder
          ml="auto"
          sx={{ height: "1.5rem", width: "8rem" }}
          mr={2}
        />
      </Flex>

      <Flex mb={3}>
        <LoadingPlaceholder sx={{ height: "1.5rem", width: "8rem" }} mr={2} />
        <LoadingPlaceholder
          ml="auto"
          sx={{ height: "1.5rem", width: "6rem" }}
          mr={2}
        />
      </Flex>

      <Flex>
        <LoadingPlaceholder sx={{ height: "1.5rem", width: "14rem" }} mr={2} />
        <LoadingPlaceholder
          ml="auto"
          sx={{ height: "1.5rem", width: "5rem" }}
          mr={2}
        />
      </Flex>
    </Box>
  </Card>
)

const EmptyState = () => (
  <Typography.Body
    my={4}
    sx={{ textAlign: "center" }}
    color="textMediumEmphasis"
  >
    <Trans>No materials in progress.</Trans>
  </Typography.Body>
)

const DisabledState = () => (
  <Box variant="responsive" px={[0, 3]}>
    <InformationalCard
      message={t`You can enable the curriculum feature to track student progress in your curriculum.`}
      buttonText={t`Go to Curriculum `}
      to={ADMIN_CURRICULUM_URL}
    />
  </Box>
)

const Heading: FC<{ text: string }> = ({ text }) => (
  <Typography.Body
    mt={4}
    mx={3}
    sx={{ fontSize: 0, color: "textMediumEmphasis" }}
  >
    <Trans id={text} />
  </Typography.Body>
)

const ExportProgressDialog: FC<{ onDismiss: () => void }> = ({ onDismiss }) => {
  return (
    <Dialog>
      <DialogHeader
        title={t`Export Progress`}
        onAccept={onDismiss}
        onCancel={onDismiss}
      />
    </Dialog>
  )
}

export default AssessmentCard
