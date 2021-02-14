/** @jsx jsx */
import { Trans } from "@lingui/macro"
import { Fragment, FC, memo } from "react"

import { jsx, Box, Button, Flex, ThemeUIStyleObject } from "theme-ui"
import { useImmer } from "use-immer"
import { borderBottom, borderRight } from "../../border"
import { useGetArea } from "../../hooks/api/useGetArea"
import { useGetSubject } from "../../hooks/api/useGetSubject"
import {
  Material,
  useGetSubjectMaterials,
} from "../../hooks/api/useGetSubjectMaterials"
import useMoveDraggableItem from "../../hooks/useMoveDraggableItem"
import { useQueryString } from "../../hooks/useQueryString"
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
import DraggableListItem from "../DraggableListItem/DraggableListItem"
import Icon from "../Icon/Icon"
import { Link } from "../Link/Link"
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
      />

      <Flex
        p={3}
        sx={{ alignItems: "center", ...borderBottom, cursor: "pointer" }}
      >
        <Icon as={PlusIcon} fill="textPrimary" />
        <Typography.Body ml={3} sx={{ color: "textMediumEmphasis" }}>
          <Trans>Add new material</Trans>
        </Typography.Body>
      </Flex>
    </Box>
  )
}

const MaterialList: FC<{
  materials: Material[]
  subjectId: string
  areaId: string
}> = ({ materials, subjectId, areaId }) => {
  const [cachedMaterials, setMaterials] = useImmer(materials)

  return (
    <Fragment>
      {cachedMaterials.map((material) => (
        <DraggableMaterialItem
          key={material.id}
          material={material}
          setMaterials={setMaterials}
          areaId={areaId}
          subjectId={subjectId}
        />
      ))}
    </Fragment>
  )
}

const DraggableMaterialItem: FC<{
  areaId: string
  subjectId: string
  material: Material
  setMaterials: (f: (draft: Material[]) => void) => void
}> = memo(({ setMaterials, areaId, subjectId, material }) => {
  const moveItem = useMoveDraggableItem(material, setMaterials)
  const materialId = useQueryString("materialId")
  const selected = material.id === materialId

  return (
    <Link
      to={CURRICULUM_MATERIAL_URL(areaId, subjectId, material.id)}
      sx={{ display: "block", maxWidth: "inherit" }}
    >
      <DraggableListItem
        order={material.order}
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

export default PageCurriculumSubject
