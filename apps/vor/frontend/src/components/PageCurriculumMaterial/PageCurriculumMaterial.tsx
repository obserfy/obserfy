import React, { FC } from "react"
import { Box, Button, Card, ThemeUIStyleObject } from "theme-ui"
import { useGetArea } from "../../hooks/api/useGetArea"
import { useGetSubject } from "../../hooks/api/useGetSubject"
import { ReactComponent as DeleteIcon } from "../../icons/trash.svg"
import {
  ADMIN_CURRICULUM_URL,
  ADMIN_URL,
  CURRICULUM_AREA_URL,
  CURRICULUM_SUBJECT_URL,
} from "../../routes"
import DataBox from "../DataBox/DataBox"
import Icon from "../Icon/Icon"
import MultilineDataBox from "../MultilineDataBox/MultilineDataBox"
import TopBar, { breadCrumb } from "../TopBar/TopBar"

export interface PageCurriculumMaterialProps {
  sx?: ThemeUIStyleObject
  areaId: string
  subjectId: string
  materialId: string
}
const PageCurriculumMaterial: FC<PageCurriculumMaterialProps> = ({
  subjectId,
  areaId,
}) => {
  const area = useGetArea(areaId)
  const subject = useGetSubject(subjectId)

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
          breadCrumb("Material"),
        ]}
      />

      <Box p={3}>
        <Card sx={{ width: "100%" }}>
          <DataBox label="Material Name" value="..." />
        </Card>

        <Card mt={3} pb={2}>
          <MultilineDataBox label="Description" value="" placeholder="..." />
        </Card>

        <Button variant="outline" sx={{ color: "danger" }} ml="auto" mt={3}>
          <Icon as={DeleteIcon} mr={2} fill="danger" />
          Delete
        </Button>
      </Box>
    </Box>
  )
}

export default PageCurriculumMaterial
