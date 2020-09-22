import React, { FC, useState } from "react"
import { Box, Button, Card, Flex } from "theme-ui"
import { Link, navigate } from "../Link/Link"
import Typography from "../Typography/Typography"
import LoadingPlaceholder from "../LoadingPlaceholder/LoadingPlaceholder"
import { useGetArea } from "../../api/useGetArea"
import { Subject, useGetAreaSubjects } from "../../api/useGetAreaSubjects"
import { useGetSubjectMaterials } from "../../api/useGetSubjectMaterials"
import Spacer from "../Spacer/Spacer"
import { ReactComponent as EditIcon } from "../../icons/edit.svg"
import { ReactComponent as PlusIcon } from "../../icons/plus.svg"
import { ReactComponent as DeleteIcon } from "../../icons/trash.svg"
import Icon from "../Icon/Icon"
import DeleteAreaDialog from "../DeleteAreaDialog/DeleteAreaDialog"
import DeleteSubjectDialog from "../DeleteSubjectDialog/DeleteSubjectDialog"
import EditAreaDialog from "../EditAreaDialog/EditAreaDialog"
import {
  ADMIN_CURRICULUM_URL,
  ADMIN_URL,
  EDIT_SUBJECT_URL,
  NEW_SUBJECT_URL,
} from "../../routes"
import TopBar from "../TopBar/TopBar"

interface Props {
  id: string
}
export const PageCurriculumArea: FC<Props> = ({ id }) => {
  const area = useGetArea(id)
  const subjects = useGetAreaSubjects(id)
  const [showDeleteAreaDialog, setShowDeleteAreaDialog] = useState(false)
  const [showDeleteSubjectDialog, setShowDeleteSubjectDialog] = useState(false)
  const [showEditAreaDialog, setShowEditAreaDialog] = useState(false)
  const [subjectToDelete, setSubjectToDelete] = useState<Subject>()
  const loading = area.isLoading || subjects.isLoading

  const subjectList = subjects.data?.map((subject) => (
    <SubjectListItem
      key={subject.id}
      subject={subject}
      areaId={id}
      onDeleteClick={() => {
        setSubjectToDelete(subject)
        setShowDeleteSubjectDialog(true)
      }}
    />
  ))

  return (
    <>
      <Box sx={{ maxWidth: "maxWidth.sm", margin: "auto" }}>
        <TopBar
          breadcrumbs={[
            {
              text: "Admin",
              to: ADMIN_URL,
            },
            {
              text: "Curriculum",
              to: ADMIN_CURRICULUM_URL,
            },
            { text: "Area" },
          ]}
        />
        {loading && !area.data?.name && <LoadingState />}
        <Typography.H4 p={3} pb={2}>
          {area.data?.name}
        </Typography.H4>
        <Flex mx={3} mt={3}>
          <Button
            variant="outline"
            onClick={() => setShowDeleteAreaDialog(true)}
            color="danger"
            sx={{ flexShrink: 0 }}
          >
            <Icon as={DeleteIcon} fill="danger" mr={2} />
            Delete
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowEditAreaDialog(true)}
            mx={2}
            sx={{ flexShrink: 0 }}
          >
            <Icon as={EditIcon} mr={2} />
            Edit
          </Button>
        </Flex>
        <Flex sx={{ alignItems: "center" }} mx={3} mt={4}>
          <Typography.H6>Subjects</Typography.H6>
          <Spacer />
          <Link to={NEW_SUBJECT_URL(id)}>
            <Button variant="outline">
              <Icon as={PlusIcon} mr={2} />
              New
            </Button>
          </Link>
        </Flex>
        {subjectList}
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

const LoadingState: FC = () => (
  <Box p={3}>
    <LoadingPlaceholder sx={{ width: "100%", height: "4rem" }} />
  </Box>
)

interface SubjectListItemProps {
  subject: Subject
  areaId: string
  onDeleteClick: () => void
}
const SubjectListItem: FC<SubjectListItemProps> = ({
  subject,
  onDeleteClick,
  areaId,
}) => {
  const materials = useGetSubjectMaterials(subject.id)

  const materialList = materials.data?.map((material) => (
    <Box
      p={3}
      px={3}
      py={2}
      key={material.id}
      sx={{
        borderTopColor: "border",
        borderTopWidth: "1px",
        borderTopStyle: "solid",
      }}
    >
      <Typography.Body
        sx={{
          fontSize: 1,
        }}
      >
        {material.name}
      </Typography.Body>
    </Box>
  ))

  const loadingPlaceholder = materials.status === "loading" && !materials.data && (
    <Box m={3}>
      <LoadingPlaceholder sx={{ width: "100%", height: "4rem" }} mb={3} />
      <LoadingPlaceholder sx={{ width: "100%", height: "4rem" }} mb={3} />
      <LoadingPlaceholder sx={{ width: "100%", height: "4rem" }} mb={3} />
      <LoadingPlaceholder sx={{ width: "100%", height: "4rem" }} mb={3} />
      <LoadingPlaceholder sx={{ width: "100%", height: "4rem" }} mb={3} />
    </Box>
  )

  return (
    <Box py={3} px={[0, 3]}>
      <Card sx={{ borderRadius: [0, "default"] }}>
        <Flex sx={{ alignItems: "center" }} m={3} mr={2}>
          <Typography.Body fontSize={3} mr={3}>
            {subject.name}
          </Typography.Body>
          <Spacer />
          <Flex sx={{ alignItems: "center", flexShrink: 0 }}>
            <Button
              sx={{ flexShrink: 0 }}
              variant="secondary"
              onClick={onDeleteClick}
            >
              <Icon as={DeleteIcon} fill="danger" />
            </Button>
            <Link to={EDIT_SUBJECT_URL(areaId, subject.id)}>
              <Button sx={{ flexShrink: 0 }} variant="secondary">
                <Icon as={EditIcon} fill="textPrimary" />
              </Button>
            </Link>
          </Flex>
        </Flex>
        {materialList}
      </Card>
      {loadingPlaceholder}
    </Box>
  )
}

export default PageCurriculumArea
