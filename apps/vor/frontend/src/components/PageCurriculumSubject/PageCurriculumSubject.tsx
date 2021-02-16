/** @jsx jsx */
import { t, Trans } from "@lingui/macro"
import { Fragment, FC, memo, useState } from "react"
import { jsx, Box, Button, Flex, ThemeUIStyleObject } from "theme-ui"
import { borderBottom, borderRight } from "../../border"
import usePostNewSubject from "../../hooks/api/curriculum/usePostNewSubject"
import { useGetArea } from "../../hooks/api/useGetArea"
import { useGetSubject } from "../../hooks/api/useGetSubject"
import {
  Material,
  useGetSubjectMaterials,
} from "../../hooks/api/useGetSubjectMaterials"
import { useMoveDraggableItem } from "../../hooks/useMoveDraggableItem"
import { useQueryString } from "../../hooks/useQueryString"
import useVisibilityState from "../../hooks/useVisibilityState"
import { ReactComponent as EditIcon } from "../../icons/edit.svg"
import { ReactComponent as NextIcon } from "../../icons/next-arrow.svg"
import { ReactComponent as PlusIcon } from "../../icons/plus.svg"
import { ReactComponent as DeleteIcon } from "../../icons/trash.svg"
import {
  ADMIN_CURRICULUM_URL,
  ADMIN_URL,
  CURRICULUM_AREA_URL,
  CURRICULUM_MATERIAL_URL,
} from "../../routes"
import DeleteSubjectDialog from "../DeleteSubjectDialog/DeleteSubjectDialog"
import Dialog from "../Dialog/Dialog"
import DialogHeader from "../DialogHeader/DialogHeader"
import DraggableListItem from "../DraggableListItem/DraggableListItem"
import Icon from "../Icon/Icon"
import Input from "../Input/Input"
import { Link, navigate } from "../Link/Link"
import Spacer from "../Spacer/Spacer"
import TopBar, { breadCrumb } from "../TopBar/TopBar"
import TranslucentBar from "../TranslucentBar/TranslucentBar"
import Typography from "../Typography/Typography"

export interface PageCurriculumSubjectProps {
  subjectId: string
  areaId: string
  sx?: ThemeUIStyleObject
}
const PageCurriculumSubject: FC<PageCurriculumSubjectProps> = ({
  areaId,
  subjectId,
  sx,
}) => {
  const area = useGetArea(areaId)
  const subject = useGetSubject(subjectId)
  const materials = useGetSubjectMaterials(subjectId)
  const materialId = useQueryString("materialId")
  const deleteSubject = useVisibilityState()
  const newMaterial = useVisibilityState()

  return (
    <Box sx={{ width: "100%", pb: 5, ...sx }}>
      <TranslucentBar boxSx={{ ...borderBottom }}>
        <TopBar
          containerSx={{ display: ["flex", "flex", "none"] }}
          breadcrumbs={[
            breadCrumb("Admin", ADMIN_URL),
            breadCrumb("Curriculum", ADMIN_CURRICULUM_URL),
            breadCrumb(area.data?.name, CURRICULUM_AREA_URL(areaId)),
            breadCrumb(subject.data?.name),
          ]}
        />

        <Flex mx={3} py={3} sx={{ alignItems: "center" }}>
          <Typography.H6 mr={3} sx={{ lineHeight: 1.2, fontSize: [3, 3, 1] }}>
            {subject.data?.name}
          </Typography.H6>

          <Button
            variant="outline"
            color="danger"
            sx={{ flexShrink: 0 }}
            px={2}
            ml="auto"
            onClick={deleteSubject.show}
          >
            <Icon size={16} as={DeleteIcon} fill="danger" />
          </Button>
          <Button variant="outline" sx={{ flexShrink: 0 }} px={2} ml={2}>
            <Icon size={16} as={EditIcon} />
          </Button>
        </Flex>
      </TranslucentBar>

      <Typography.Body
        px={3}
        py={2}
        sx={{ fontWeight: "bold", ...borderBottom }}
      >
        <Trans>Materials</Trans>
      </Typography.Body>
      <Spacer />

      <MaterialList
        key={materials.data?.map(({ id }) => id).join(",") ?? ""}
        subjectId={subjectId}
        areaId={areaId}
        materials={materials.data ?? []}
        currMaterialId={materialId}
      />

      <Flex
        role="button"
        p={3}
        sx={{ alignItems: "center", ...borderBottom, cursor: "pointer" }}
        onClick={() => newMaterial.show()}
      >
        <Icon as={PlusIcon} fill="textPrimary" />
        <Typography.Body ml={3} sx={{ color: "textMediumEmphasis" }}>
          <Trans>Add new material</Trans>
        </Typography.Body>
      </Flex>

      {newMaterial.visible && (
        <NewMaterialDialog onDismiss={newMaterial.hide} subjectId={subjectId} />
      )}

      {deleteSubject.visible && (
        <DeleteSubjectDialog
          areaId={areaId}
          onDismiss={deleteSubject.hide}
          subjectId={subjectId}
          name={subject.data?.name}
          onDeleted={() => navigate(CURRICULUM_AREA_URL(areaId))}
        />
      )}
    </Box>
  )
}

const MaterialList: FC<{
  materials: Material[]
  subjectId: string
  areaId: string
  currMaterialId: string
}> = ({ materials, subjectId, areaId, currMaterialId }) => {
  const [cachedMaterials, moveItem] = useMoveDraggableItem(materials)

  return (
    <Fragment>
      {cachedMaterials.map((material) => (
        <DraggableMaterialItem
          key={material.id}
          material={material}
          currMaterialId={currMaterialId}
          areaId={areaId}
          subjectId={subjectId}
          moveItem={moveItem}
        />
      ))}
    </Fragment>
  )
}

const DraggableMaterialItem: FC<{
  areaId: string
  subjectId: string
  material: Material
  currMaterialId: string
  moveItem: (currItem: Material, newOrder: number) => void
}> = memo(({ moveItem, currMaterialId, areaId, subjectId, material }) => {
  const selected = material.id === currMaterialId

  return (
    <Link
      to={CURRICULUM_MATERIAL_URL(areaId, subjectId, material.id)}
      sx={{ display: "block", maxWidth: "inherit" }}
    >
      <DraggableListItem
        item={material}
        moveItem={moveItem}
        height={54}
        containerSx={{
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
          {material.name}
        </Typography.Body>
        <Icon as={NextIcon} ml="auto" mr={3} fill="currentColor" />
      </DraggableListItem>
    </Link>
  )
})

const NewMaterialDialog: FC<{ subjectId: string; onDismiss: () => void }> = ({
  subjectId,
  onDismiss,
}) => {
  const [name, setName] = useState("")
  const newSubject = usePostNewSubject(subjectId)

  const handleSave = async () => {
    try {
      await newSubject.mutateAsync({ name })
      onDismiss()
    } catch (e) {
      Sentry.captureException(e)
    }
  }

  return (
    <Dialog>
      <DialogHeader
        title={t`New Material`}
        disableAccept={newSubject.isLoading}
        loading={newSubject.isLoading}
        onCancel={onDismiss}
        onAccept={handleSave}
      />
      <Box p={3} sx={{ backgroundColor: "background" }}>
        <Input
          sx={{ width: "100%" }}
          label="Material name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </Box>
    </Dialog>
  )
}

export default PageCurriculumSubject
