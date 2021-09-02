import { t, Trans } from "@lingui/macro"
import { FC, Fragment, memo, useEffect, useState } from "react"
import { Box, Button, Flex } from "theme-ui"
import { borderBottom, borderRight } from "../../border"
import usePatchMaterial from "../../hooks/api/curriculum/usePatchMaterial"
import usePostNewMaterial from "../../hooks/api/curriculum/usePostNewMaterial"
import { useGetArea } from "../../hooks/api/useGetArea"
import { useGetSubject } from "../../hooks/api/useGetSubject"
import {
  Material,
  useGetSubjectMaterials,
} from "../../hooks/api/useGetSubjectMaterials"
import useDebounce from "../../hooks/useDebounce"
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
import CurriculumListLoadingPlaceholder from "../CurriculumListLoadingPlaceholder/CurriculumListLoadingPlaceholder"
import DeleteSubjectDialog from "../DeleteSubjectDialog/DeleteSubjectDialog"
import Dialog from "../Dialog/Dialog"
import DialogHeader from "../DialogHeader/DialogHeader"
import DraggableListItem from "../DraggableListItem/DraggableListItem"
import Icon from "../Icon/Icon"
import Input from "../Input/Input"
import { Link, navigate } from "../Link/Link"
import LoadingPlaceholder from "../LoadingPlaceholder/LoadingPlaceholder"
import Spacer from "../Spacer/Spacer"
import TopBar, { breadCrumb } from "../TopBar/TopBar"
import TranslucentBar from "../TranslucentBar/TranslucentBar"
import Typography from "../Typography/Typography"
import EditSubjectDialog from "./EditSubjectDialog"

export interface PageCurriculumSubjectProps {
  subjectId: string
  areaId: string
  className?: string
}

const PageCurriculumSubject: FC<PageCurriculumSubjectProps> = ({
  areaId,
  subjectId,
  className,
}) => {
  const materialId = useQueryString("materialId")

  const area = useGetArea(areaId)
  const subject = useGetSubject(subjectId)
  const materials = useGetSubjectMaterials(subjectId)

  const deleteSubject = useVisibilityState()
  const newMaterial = useVisibilityState()
  const editSubject = useVisibilityState()

  return (
    <Box
      className={className}
      sx={{ position: "relative", width: "100%", pb: 5 }}
    >
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
            {subject.isLoading ? (
              <LoadingPlaceholder sx={{ height: 24, width: 112 }} />
            ) : (
              subject.data?.name
            )}
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
          <Button
            variant="outline"
            sx={{ flexShrink: 0 }}
            px={2}
            ml={2}
            onClick={editSubject.show}
          >
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

      {materials.isLoading ? (
        <CurriculumListLoadingPlaceholder length={3} />
      ) : (
        <MaterialList
          subjectId={subjectId}
          areaId={areaId}
          materials={materials.data ?? []}
          currMaterialId={materialId}
        />
      )}

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

      {editSubject.visible && (
        <EditSubjectDialog
          initialValue={subject.data?.name}
          onDismiss={editSubject.hide}
          onSave={editSubject.hide}
          subjectId={subjectId}
          areaId={areaId}
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
  const [isLoading, setIsLoading] = useState(false)
  const [cachedMaterials, moveItem, setMaterials] =
    useMoveDraggableItem(materials)

  const debouncedIsLoading = useDebounce(isLoading)

  useEffect(() => {
    setMaterials(() => materials)
  }, [materials])

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
          isLoading={debouncedIsLoading}
          onLoadingStateChange={(state) => {
            setIsLoading(state)
          }}
        />
      ))}
      {debouncedIsLoading && (
        <Typography.Body
          pt={7}
          sx={{
            fontWeight: "bold",
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            textAlign: "center",
            pointerEvents: "none",
          }}
        >
          Saving
        </Typography.Body>
      )}
    </Fragment>
  )
}

const DraggableMaterialItem: FC<{
  areaId: string
  subjectId: string
  material: Material
  currMaterialId: string
  moveItem: (currItem: Material, newOrder: number) => void
  onLoadingStateChange: (isLoading: boolean) => void
  isLoading: boolean
}> = memo(
  ({
    moveItem,
    currMaterialId,
    areaId,
    subjectId,
    material,
    onLoadingStateChange,
    isLoading,
  }) => {
    const selected = material.id === currMaterialId
    const patchMaterial = usePatchMaterial(material.id, subjectId)

    const handleReorder = async () => {
      try {
        onLoadingStateChange(true)
        await patchMaterial.mutateAsync({ order: material.order })
      } catch (e) {
        Sentry.captureException(e)
      } finally {
        onLoadingStateChange(false)
      }
    }

    return (
      <Link
        to={CURRICULUM_MATERIAL_URL(areaId, subjectId, material.id)}
        sx={{
          display: "block",
          maxWidth: "inherit",
          opacity: isLoading ? 0.2 : 1,
          transition: "opacity 0.1s ease-in",
          pointerEvents: isLoading ? "none" : undefined,
        }}
      >
        <DraggableListItem
          item={material}
          moveItem={moveItem}
          height={54}
          onDrop={handleReorder}
          disableDrag={isLoading}
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
          <Typography.Body className="truncate" sx={{ color: "inherit" }}>
            {material.name}
          </Typography.Body>
          <Icon as={NextIcon} ml="auto" mr={3} fill="currentColor" />
        </DraggableListItem>
      </Link>
    )
  }
)

const NewMaterialDialog: FC<{ subjectId: string; onDismiss: () => void }> = ({
  subjectId,
  onDismiss,
}) => {
  const [name, setName] = useState("")
  const newMaterial = usePostNewMaterial(subjectId)

  const handleSave = async () => {
    try {
      await newMaterial.mutateAsync({ name })
      onDismiss()
    } catch (e) {
      Sentry.captureException(e)
    }
  }

  return (
    <Dialog>
      <DialogHeader
        title={t`New Material`}
        disableAccept={newMaterial.isLoading}
        loading={newMaterial.isLoading}
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
