import { Trans } from "@lingui/macro"
import React, { FC, useState } from "react"
import { Box, Button, Flex, ThemeUIStyleObject } from "theme-ui"
import { borderBottom, borderRight } from "../../border"
import { compareOrder } from "../../domain/array"
import { useGetArea } from "../../hooks/api/useGetArea"
import { Subject, useGetAreaSubjects } from "../../hooks/api/useGetAreaSubjects"
import { useQueryString } from "../../hooks/useQueryString"
import { ReactComponent as EditIcon } from "../../icons/edit.svg"
import { ReactComponent as NextIcon } from "../../icons/next-arrow.svg"
import { ReactComponent as PlusIcon } from "../../icons/plus.svg"
import { ReactComponent as DeleteIcon } from "../../icons/trash.svg"
import {
  ADMIN_CURRICULUM_URL,
  ADMIN_URL,
  CURRICULUM_SUBJECT_URL,
} from "../../routes"
import DeleteAreaDialog from "../DeleteAreaDialog/DeleteAreaDialog"
import DeleteSubjectDialog from "../DeleteSubjectDialog/DeleteSubjectDialog"
import EditAreaDialog from "../EditAreaDialog/EditAreaDialog"
import Icon from "../Icon/Icon"
import { Link, navigate } from "../Link/Link"
import TopBar, { breadCrumb } from "../TopBar/TopBar"
import TranslucentBar from "../TranslucentBar/TranslucentBar"
import Typography from "../Typography/Typography"

interface Props {
  id: string
  sx?: ThemeUIStyleObject
}
const PageCurriculumArea: FC<Props> = ({ id, sx }) => {
  const area = useGetArea(id)
  const subjects = useGetAreaSubjects(id)
  const [showDeleteAreaDialog, setShowDeleteAreaDialog] = useState(false)
  const [showDeleteSubjectDialog, setShowDeleteSubjectDialog] = useState(false)
  const [showEditAreaDialog, setShowEditAreaDialog] = useState(false)
  const [subjectToDelete, setSubjectToDelete] = useState<Subject>()

  return (
    <>
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
            sx={{ display: ["flex", "flex", "none"] }}
            breadcrumbs={[
              breadCrumb("Admin", ADMIN_URL),
              breadCrumb("Curriculum", ADMIN_CURRICULUM_URL),
              breadCrumb(`${area.data?.name}`),
            ]}
          />

          <Flex mx={3} py={3} sx={{ alignItems: "center" }}>
            <Typography.H6
              mr={3}
              sx={{
                lineHeight: 1.2,
                fontSize: [3, 3, 1],
              }}
            >
              {area.data?.name}
            </Typography.H6>
            <Button
              variant="outline"
              onClick={() => setShowDeleteAreaDialog(true)}
              color="danger"
              sx={{ flexShrink: 0 }}
              px={2}
              ml="auto"
            >
              <Icon size={16} as={DeleteIcon} fill="danger" />
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowEditAreaDialog(true)}
              sx={{ flexShrink: 0 }}
              px={2}
              ml={2}
            >
              <Icon size={16} as={EditIcon} />
            </Button>
          </Flex>
        </TranslucentBar>

        <Typography.Body
          py={2}
          px={3}
          sx={{ fontWeight: "bold", ...borderBottom }}
        >
          <Trans>Subjects</Trans>
        </Typography.Body>

        {subjects.data?.sort(compareOrder).map((subject) => (
          <SubjectListItem
            key={subject.id}
            subject={subject}
            areaId={id}
            onDeleteClick={() => {
              setSubjectToDelete(subject)
              setShowDeleteSubjectDialog(true)
            }}
          />
        ))}

        <Flex
          p={3}
          sx={{ alignItems: "center", cursor: "pointer", ...borderBottom }}
        >
          <Icon as={PlusIcon} fill="textPrimary" />
          <Typography.Body ml={3} sx={{ color: "textMediumEmphasis" }}>
            <Trans>Add new subject</Trans>
          </Typography.Body>
        </Flex>
      </Box>

      {showDeleteAreaDialog && (
        <DeleteAreaDialog
          name={area.data?.name ?? ""}
          onDismiss={() => setShowDeleteAreaDialog(false)}
          onDeleted={() => navigate(ADMIN_CURRICULUM_URL)}
          areaId={id}
        />
      )}

      {showDeleteSubjectDialog && subjectToDelete && (
        <DeleteSubjectDialog
          subjectId={subjectToDelete.id}
          name={subjectToDelete.name}
          onDismiss={() => setShowDeleteSubjectDialog(false)}
          onDeleted={async () => {
            await subjects.refetch()
            setShowDeleteSubjectDialog(false)
          }}
        />
      )}

      {showEditAreaDialog && area.data && (
        <EditAreaDialog
          areaId={id}
          originalName={area.data.name}
          onDismiss={() => setShowEditAreaDialog(false)}
          onSaved={async () => {
            await area.refetch()
            setShowEditAreaDialog(false)
          }}
        />
      )}
    </>
  )
}

interface SubjectListItemProps {
  subject: Subject
  areaId: string
  onDeleteClick: () => void
}
const SubjectListItem: FC<SubjectListItemProps> = ({ areaId, subject }) => {
  const subjectId = useQueryString("subjectId")
  const selected = subjectId === subject.id

  return (
    <Link
      key={subject.id}
      to={CURRICULUM_SUBJECT_URL(areaId, subject.id)}
      sx={{ display: "block" }}
    >
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
          {subject.name}
        </Typography.Body>
        <Icon as={NextIcon} ml="auto" fill="currentColor" />
      </Flex>
    </Link>
  )
}

export default PageCurriculumArea
