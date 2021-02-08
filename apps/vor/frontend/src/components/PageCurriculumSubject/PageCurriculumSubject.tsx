import React, { FC } from "react"
import { Box, Button, Flex } from "theme-ui"
import { borderBottom, borderRight } from "../../border"
import { useGetArea } from "../../hooks/api/useGetArea"
import { useGetSubject } from "../../hooks/api/useGetSubject"
import { ReactComponent as EditIcon } from "../../icons/edit.svg"
import { ReactComponent as DeleteIcon } from "../../icons/trash.svg"
import { ADMIN_CURRICULUM_URL, ADMIN_URL } from "../../routes"
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
  const subject = useGetSubject(subjectId)
  const area = useGetArea(areaId)

  return (
    <Box
      sx={{
        position: "sticky",
        left: 0,
        right: 0,
        width: "100%",
        overflow: "auto",
        height: ["auto", "auto", "100vh"],
        maxWidth: ["100%", "100%", 340],
        pb: 5,
        ...borderRight,
      }}
    >
      <TranslucentBar boxSx={{ ...borderBottom }}>
        <TopBar
          sx={{ display: ["block", "flex", "none"] }}
          breadcrumbs={[
            breadCrumb("Admin", ADMIN_URL),
            breadCrumb("Curriculum", ADMIN_CURRICULUM_URL),
            breadCrumb(`${area.data?.name} Area`),
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
    </Box>
  )
}

export default PageCurriculumSubject
