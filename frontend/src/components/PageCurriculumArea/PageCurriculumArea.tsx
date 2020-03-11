import React, { FC, useState } from "react"
import { Link, navigate } from "gatsby-plugin-intl3"
import { useImmer } from "use-immer"
import Box from "../Box/Box"
import Typography from "../Typography/Typography"
import LoadingPlaceholder from "../LoadingPlaceholder/LoadingPlaceholder"
import Card from "../Card/Card"
import BackNavigation from "../BackNavigation/BackNavigation"
import { useGetArea } from "../../api/useGetArea"
import { Subject, useGetAreaSubjects } from "../../api/useGetAreaSubjects"
import {
  Material,
  useGetSubjectMaterials,
} from "../../api/useGetSubjectMaterials"
import Flex from "../Flex/Flex"
import Button from "../Button/Button"
import Spacer from "../Spacer/Spacer"
import { ReactComponent as EditIcon } from "../../icons/edit.svg"
import { ReactComponent as PlusIcon } from "../../icons/plus.svg"
import { ReactComponent as DeleteIcon } from "../../icons/trash.svg"
import Icon from "../Icon/Icon"
import DeleteAreaDialog from "../DeleteAreaDialog/DeleteAreaDialog"
import DeleteSubjectDialog from "../DeleteSubjectDialog/DeleteSubjectDialog"
import EditAreaDialog from "../EditAreaDialog/EditAreaDialog"
import EditSubjectDialog from "../EditSubjectDialog/EditSubjectDialog"
import { NEW_SUBJECT_URL } from "../../pages/dashboard/settings/curriculum/subjects/new"

// FIXME: Typescript any typing, and inconsistent loading state should be fixed.
interface Props {
  id: string
}
export const PageCurriculumArea: FC<Props> = ({ id }) => {
  const area = useGetArea(id)
  const [subjects, subjectsLoading, setSubjectsOutdated] = useGetAreaSubjects(
    id
  )
  const [showDeleteAreaDialog, setShowDeleteAreaDialog] = useState(false)
  const [showDeleteSubjectDialog, setShowDeleteSubjectDialog] = useState(false)
  const [showEditAreaDialog, setShowEditAreaDialog] = useState(false)
  const [showEditSubjectDialog, setShowEditSubjectDialog] = useState(false)
  const [editedSubject, setEditedSubject] = useImmer<
    (Subject & { materials: Material[] }) | undefined
  >(undefined)
  const [subjectToDelete, setSubjectToDelete] = useState<Subject>()
  const loading = area.isFetching || subjectsLoading

  const subjectList = subjects
    ?.sort((a, b) => b.order - a.order)
    .map(subject => (
      <Box key={subject.id}>
        <SubjectListItem
          subject={subject}
          onEditClick={target => {
            setEditedSubject(() => target)
            setShowEditSubjectDialog(true)
          }}
          onDeleteClick={() => {
            setSubjectToDelete(subject)
            setShowDeleteSubjectDialog(true)
          }}
        />
      </Box>
    ))

  return (
    <>
      <Box maxWidth="maxWidth.sm" margin="auto">
        <BackNavigation to="/dashboard/settings/curriculum" text="Curriculum" />
        {loading && <LoadingState />}
        <Typography.H3 p={3} pb={2} lineHeight={1}>
          {area.data?.name}
        </Typography.H3>
        <Flex mx={3} mt={3}>
          <Button
            variant="outline"
            onClick={() => setShowDeleteAreaDialog(true)}
            color="danger"
            sx={{ flexShrink: 0 }}
          >
            <Icon as={DeleteIcon} m={0} fill="danger" mr={2} />
            Delete
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowEditAreaDialog(true)}
            mx={2}
            sx={{ flexShrink: 0 }}
          >
            <Icon as={EditIcon} m={0} mr={2} />
            Edit
          </Button>
        </Flex>
        <Flex alignItems="center" mx={3} mt={4}>
          <Typography.H5
            fontWeight="normal"
            color="textMediumEmphasis"
            letterSpacing={3}
          >
            SUBJECTS
          </Typography.H5>
          <Spacer />
          <Link to={NEW_SUBJECT_URL(id)}>
            <Button variant="outline">
              <Icon as={PlusIcon} m={0} mr={2} />
              New
            </Button>
          </Link>
        </Flex>
        {!loading && subjectList}
      </Box>
      {showDeleteAreaDialog && (
        <DeleteAreaDialog
          name={area.data?.name ?? ""}
          onDismiss={() => setShowDeleteAreaDialog(false)}
          onDeleted={() => navigate("/dashboard/settings/curriculum")}
          areaId={id}
        />
      )}
      {showDeleteSubjectDialog && subjectToDelete && (
        <DeleteSubjectDialog
          subjectId={subjectToDelete.id}
          name={subjectToDelete.name}
          onDismiss={() => setShowDeleteSubjectDialog(false)}
          onDeleted={() => {
            setSubjectsOutdated()
            setShowDeleteSubjectDialog(false)
          }}
        />
      )}
      {showEditAreaDialog && area.data && (
        <EditAreaDialog
          areaId={id}
          originalName={area.data.name}
          onDismiss={() => setShowEditAreaDialog(false)}
          onSaved={() => {
            area.refetch()
            setShowEditAreaDialog(false)
          }}
        />
      )}
      {showEditSubjectDialog && editedSubject && (
        <EditSubjectDialog
          areaId={id}
          subject={editedSubject}
          onDismiss={() => setShowEditSubjectDialog(false)}
          onSaved={() => {
            setSubjectsOutdated()
            setShowEditSubjectDialog(false)
          }}
        />
      )}
    </>
  )
}

const LoadingState: FC = () => (
  <Box p={3}>
    <LoadingPlaceholder width="100%" height="4rem" />
  </Box>
)

interface SubjectListItemProps {
  subject: Subject
  onDeleteClick: () => void
  onEditClick: (subject: Subject & { materials: Material[] }) => void
}
const SubjectListItem: FC<SubjectListItemProps> = ({
  subject,
  onDeleteClick,
  onEditClick,
}) => {
  const [materials, loading] = useGetSubjectMaterials(subject.id)

  const materialList = materials?.map(material => (
    <Box
      p={3}
      px={3}
      py={2}
      key={material.id}
      sx={{
        borderTopColor: "border",
        borderTopWidth: 1,
        borderTopStyle: "solid",
      }}
    >
      <Typography.Body fontSize={1}>{material.name}</Typography.Body>
    </Box>
  ))

  const loadingPlaceholder = loading && (
    <Box m={3}>
      <LoadingPlaceholder width="100%" height="4rem" mb={3} />
      <LoadingPlaceholder width="100%" height="4rem" mb={3} />
      <LoadingPlaceholder width="100%" height="4rem" mb={3} />
      <LoadingPlaceholder width="100%" height="4rem" mb={3} />
      <LoadingPlaceholder width="100%" height="4rem" mb={3} />
    </Box>
  )

  return (
    <Box py={3} px={[0, 3]}>
      <Card borderRadius={[0, "default"]}>
        <Flex alignItems="center" m={3} mr={2}>
          <Typography.Body fontSize={3} mr={3}>
            {subject.name}
          </Typography.Body>
          <Spacer />
          <Flex alignItems="center" sx={{ flexShrink: 0 }}>
            <Button
              sx={{ flexShrink: 0 }}
              variant="secondary"
              onClick={onDeleteClick}
            >
              <Icon as={DeleteIcon} m={0} fill="danger" />
            </Button>
            <Button
              sx={{ flexShrink: 0 }}
              variant="secondary"
              onClick={() => {
                onEditClick({ ...subject, materials })
              }}
            >
              <Icon as={EditIcon} m={0} fill="textPrimary" />
            </Button>
          </Flex>
        </Flex>
        {materialList}
      </Card>
      {loadingPlaceholder}
    </Box>
  )
}

export default PageCurriculumArea
