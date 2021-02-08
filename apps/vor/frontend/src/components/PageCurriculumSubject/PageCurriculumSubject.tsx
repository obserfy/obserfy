import React, { FC } from "react"
import { Box, Button, Flex } from "theme-ui"
import { borderBottom, borderRight } from "../../border"
import { useGetArea } from "../../hooks/api/useGetArea"
import { useGetSubject } from "../../hooks/api/useGetSubject"
import { useGetSubjectMaterials } from "../../hooks/api/useGetSubjectMaterials"
import { ReactComponent as EditIcon } from "../../icons/edit.svg"
import { ReactComponent as NextIcon } from "../../icons/next-arrow.svg"
import { ReactComponent as DeleteIcon } from "../../icons/trash.svg"
import {
  ADMIN_CURRICULUM_URL,
  ADMIN_URL,
  CURRICULUM_AREA_URL,
} from "../../routes"
import Icon from "../Icon/Icon"
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
    <Box sx={{ width: "100%", pb: 5, ...borderRight }}>
      <TranslucentBar boxSx={{ ...borderBottom }}>
        <TopBar
          sx={{ display: ["block", "flex", "none"] }}
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

      {materials.data?.map((material) => (
        <Material
          key={material.id}
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
  name: string
  description: string
}> = ({ areaId, name }) => (
  <Flex
    p={3}
    sx={{
      ...borderBottom,
      alignItems: "center",
      "&:hover": {
        backgroundColor: "primaryLightest",
      },
    }}
  >
    <Typography.Body>{name}</Typography.Body>
    <Icon as={NextIcon} ml="auto" />
  </Flex>
)

export default PageCurriculumSubject
