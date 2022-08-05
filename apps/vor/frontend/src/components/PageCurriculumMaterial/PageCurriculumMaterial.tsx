import { t, Trans } from "@lingui/macro"
import { FC, useState } from "react"
import { Box, Button, Card, ThemeUIStyleObject } from "theme-ui"
import useDeleteMaterial from "../../hooks/api/curriculum/useDeleteMaterial"
import useGetMaterial from "../../hooks/api/curriculum/useGetMaterial"
import usePatchMaterial from "../../hooks/api/curriculum/usePatchMaterial"
import { useGetArea } from "../../hooks/api/useGetArea"
import { useGetSubject } from "../../hooks/api/useGetSubject"
import useVisibilityState from "../../hooks/useVisibilityState"
import { ReactComponent as DeleteIcon } from "../../icons/trash.svg"
import {
  ADMIN_CURRICULUM_URL,
  ADMIN_URL,
  CURRICULUM_AREA_URL,
  CURRICULUM_SUBJECT_URL,
} from "../../routes"
import DataBox from "../DataBox/DataBox"
import { Dialog } from "../Dialog/Dialog"
import DialogHeader from "../DialogHeader/DialogHeader"
import Icon from "../Icon/Icon"
import Input from "../Input/Input"
import { navigate } from "../Link/Link"
import MultilineDataBox from "../MultilineDataBox/MultilineDataBox"
import TopBar, { breadCrumb } from "../TopBar/TopBar"
import Typography from "../Typography/Typography"
import DescriptionEditor from "./DescriptionEditor"

export interface PageCurriculumMaterialProps {
  sx?: ThemeUIStyleObject
  areaId: string
  subjectId: string
  materialId: string
}
const PageCurriculumMaterial: FC<PageCurriculumMaterialProps> = ({
  subjectId,
  areaId,
  materialId,
}) => {
  const area = useGetArea(areaId)
  const subject = useGetSubject(subjectId)
  const material = useGetMaterial(materialId)

  const descriptionEditor = useVisibilityState()
  const deleteDialog = useVisibilityState()

  return (
    <Box mx="auto" sx={{ maxWidth: "maxWidth.lg", width: "100%" }}>
      <TopBar
        containerSx={{ display: ["flex", "flex", "none"] }}
        breadcrumbs={[
          breadCrumb("Admin", ADMIN_URL),
          breadCrumb("Curriculum", ADMIN_CURRICULUM_URL),
          breadCrumb(area.data?.name ?? "", CURRICULUM_AREA_URL(areaId)),
          breadCrumb(
            subject.data?.name ?? "",
            CURRICULUM_SUBJECT_URL(areaId, subjectId)
          ),
          breadCrumb(material.data?.name ?? ""),
        ]}
      />

      <Box pt={[0, 0, 3]}>
        <NameDataBox
          name={material.data?.name ?? "..."}
          materialId={materialId}
          subjectId={subjectId}
        />

        {descriptionEditor.visible ? (
          <DescriptionEditor
            initialValue={material.data?.description}
            onDismiss={descriptionEditor.hide}
            onSave={descriptionEditor.hide}
            materialId={materialId}
            subjectId={subjectId}
          />
        ) : (
          <Card variant="responsive" pb={2}>
            <MultilineDataBox
              key={material.data?.description}
              label="Description"
              value={material.data?.description ?? ""}
              placeholder={t`Not set`}
              onEditClick={descriptionEditor.show}
            />
          </Card>
        )}

        <Button
          variant="outline"
          sx={{ color: "danger" }}
          ml="auto"
          mt={3}
          mr={3}
          onClick={deleteDialog.show}
        >
          <Icon as={DeleteIcon} mr={2} fill="danger" />
          <Trans>Delete material</Trans>
        </Button>
      </Box>

      {deleteDialog.visible && (
        <DeleteMaterialDialog
          materialId={materialId}
          name={material.data?.name}
          onDismiss={deleteDialog.hide}
          subjectId={subjectId}
          onDeleted={() => {
            navigate(CURRICULUM_SUBJECT_URL(areaId, subjectId))
          }}
        />
      )}
    </Box>
  )
}

const DeleteMaterialDialog: FC<{
  materialId: string
  subjectId: string
  name?: string
  onDismiss: () => void
  onDeleted: () => void
}> = ({ onDeleted, materialId, onDismiss, subjectId, name = "" }) => {
  const deleteMaterial = useDeleteMaterial(materialId, subjectId)

  const handleDelete = () => {
    try {
      deleteMaterial.mutate()
      onDeleted()
    } catch (e) {
      Sentry.captureException(e)
    }
  }

  return (
    <Dialog>
      <DialogHeader
        title={t`Delete Material`}
        onCancel={onDismiss}
        onAccept={handleDelete}
        onAcceptText={t`Delete`}
      />
      <Box p={3} sx={{ backgroundColor: "background" }}>
        <Typography.Body>
          <Trans>
            This will permanently delete ${name} and data related to it. Are you
            sure?
          </Trans>
        </Typography.Body>
      </Box>
    </Dialog>
  )
}

const NameDataBox: FC<{
  name: string
  materialId: string
  subjectId: string
}> = ({ name, materialId, subjectId }) => {
  const editDialog = useVisibilityState()

  return (
    <Box px={[0, 3]}>
      <Card
        mb={3}
        sx={{
          width: "100%",
          boxSizing: "border-box",
          borderRadius: [0, "default"],
        }}
      >
        <DataBox
          label="Material Name"
          value={name}
          onEditClick={editDialog.show}
        />
      </Card>
      {editDialog.visible && (
        <EditMaterialNameDialog
          initialValue={name}
          onDismiss={editDialog.hide}
          onSave={editDialog.hide}
          materialId={materialId}
          subjectId={subjectId}
        />
      )}
    </Box>
  )
}

const EditMaterialNameDialog: FC<{
  initialValue: string
  onSave: () => void
  onDismiss: () => void
  materialId: string
  subjectId: string
}> = ({ onSave, onDismiss, initialValue, materialId, subjectId }) => {
  const patchMaterial = usePatchMaterial(materialId, subjectId)
  const [value, setValue] = useState(initialValue)

  const handleSave = async () => {
    try {
      await patchMaterial.mutateAsync({ name: value })
      onSave()
    } catch (e) {
      Sentry.captureException(e)
    }
  }

  return (
    <Dialog>
      <DialogHeader
        title={t`Edit Material Name`}
        onCancel={onDismiss}
        onAccept={handleSave}
      />

      <Box p={3} sx={{ backgroundColor: "background" }}>
        <Input
          label="Name"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          sx={{ width: "100%" }}
        />
      </Box>
    </Dialog>
  )
}

export default PageCurriculumMaterial
