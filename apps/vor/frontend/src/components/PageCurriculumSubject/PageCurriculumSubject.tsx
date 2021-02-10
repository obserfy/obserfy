import { Trans } from "@lingui/macro"
import React, { FC } from "react"
import { Box, Button, Flex } from "theme-ui"
import { borderBottom, borderRight } from "../../border"
import { useGetArea } from "../../hooks/api/useGetArea"
import { useGetSubject } from "../../hooks/api/useGetSubject"
import { useGetSubjectMaterials } from "../../hooks/api/useGetSubjectMaterials"
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
import Icon from "../Icon/Icon"
import { Link } from "../Link/Link"
import Spacer from "../Spacer/Spacer"
import TopBar, { breadCrumb } from "../TopBar/TopBar"
import TranslucentBar from "../TranslucentBar/TranslucentBar"
import Typography from "../Typography/Typography"

export interface PageCurriculumSubjectProps {
  subjectId: string
  areaId: string
}
const PageCurriculumSubject: FC<PageCurriculumSubjectProps> = ({
  areaId,
  subjectId,
}) => {
  const area = useGetArea(areaId)
  const subject = useGetSubject(subjectId)
  const materials = useGetSubjectMaterials(subjectId)

  return (
    <Box sx={{ width: "100%", pb: 5 }}>
      <TranslucentBar boxSx={{ ...borderBottom }}>
        <TopBar
          sx={{ display: ["flex", "flex", "none"] }}
          breadcrumbs={[
            breadCrumb("Admin", ADMIN_URL),
            breadCrumb("Curriculum", ADMIN_CURRICULUM_URL),
            breadCrumb(area.data?.name, CURRICULUM_AREA_URL(areaId)),
            breadCrumb(subject.data?.name),
          ]}
        />

        <Flex mx={3} py={3} sx={{ alignItems: "center" }}>
          <Typography.H6 sx={{ lineHeight: 1.2 }}>
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

      <Flex sx={{ alignItems: "center", ...borderBottom }} p={3}>
        <Typography.Body sx={{ fontWeight: "bold" }}>
          <Trans>Materials</Trans>
        </Typography.Body>
        <Spacer />

        <Button variant="outline" px={2}>
          <Icon size={16} as={PlusIcon} />
        </Button>
      </Flex>

      {materials.data?.map((material) => (
        <Material
          key={material.id}
          materialId={material.id}
          subjectId={subjectId}
          name={material.name}
          description=""
          areaId={areaId}
        />
      ))}
    </Box>
  )
}

const Material: FC<{
  areaId: string
  subjectId: string
  materialId: string
  name: string
  description: string
}> = ({ name, materialId, areaId, subjectId }) => {
  const currentId = useQueryString("materialId")
  const selected = materialId === currentId

  return (
    <Link to={CURRICULUM_MATERIAL_URL(areaId, subjectId, materialId)}>
      <Flex
        p={3}
        sx={{
          ...borderBottom,
          ...borderRight,
          borderRightColor: "textPrimary",
          borderRightWidth: 2,
          borderRightStyle: selected ? "solid" : "none",
          backgroundColor: selected ? "primaryLightest" : "background",
          color: selected ? "textPrimary" : "text",
          alignItems: "center",
          "&:hover": {
            backgroundColor: "primaryLightest",
          },
        }}
      >
        <Typography.Body sx={{ color: "inherit" }}>{name}</Typography.Body>
        <Icon as={NextIcon} ml="auto" fill="currentColor" />
      </Flex>
    </Link>
  )
}

export default PageCurriculumSubject
