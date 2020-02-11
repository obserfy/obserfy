import React, { FC, useState } from "react"
import Box from "../Box/Box"
import Typography from "../Typography/Typography"
import LoadingPlaceholder from "../LoadingPlaceholder/LoadingPlaceholder"
import Card from "../Card/Card"
import BackNavigation from "../BackNavigation/BackNavigation"
import { useGetArea } from "../../api/useGetArea"
import { Subject, useGetAreaSubjects } from "../../api/useGetAreaSubjects"
import { useGetSubjectMaterials } from "../../api/useGetSubjectMaterials"
import Flex from "../Flex/Flex"
import Button from "../Button/Button"
import Spacer from "../Spacer/Spacer"
import { ReactComponent as EditIcon } from "../../icons/edit.svg"
import { ReactComponent as PlusIcon } from "../../icons/plus.svg"
import Icon from "../Icon/Icon"
import NewSubjectDialog from "../NewSubjectDialog/NewSubjectDialog"

// FIXME: Typescript any typing, and inconsistent loading state should be fixed.
interface Props {
  id: string
}
export const PageCurriculumArea: FC<Props> = ({ id }) => {
  const area = useGetArea(id)
  const [subjects, subjectsLoading] = useGetAreaSubjects(id)
  const [showNewSubjectDialog, setShowNewSubjectDialog] = useState(false)
  const loading = area.loading || subjectsLoading

  const subjectList = subjects?.map(subject => (
    <Box key={subject.id}>
      <SubjectMaterials subject={subject} />
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
        <Box mx={3} mt={3}>
          <Button
            variant="outline"
            width="100%"
            onClick={() => setShowNewSubjectDialog(true)}
          >
            <Icon as={PlusIcon} m={0} mr={2} />
            New Subject
          </Button>
        </Box>
        {!loading && subjectList}
      </Box>
      {showNewSubjectDialog && (
        <NewSubjectDialog onDismiss={() => setShowNewSubjectDialog(false)} />
      )}
    </>
  )
}

const LoadingState: FC = () => (
  <Box p={3}>
    <LoadingPlaceholder width="100%" height="4rem" />
  </Box>
)

interface SubjectProps {
  subject: Subject
}
const SubjectMaterials: FC<SubjectProps> = ({ subject }) => {
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
        <Flex alignItems="center" m={3}>
          <Typography.Body fontSize={3} mr={3}>
            {subject.name}
          </Typography.Body>
          <Spacer />
          <Flex height="46px" alignItems="center" sx={{ flexShrink: 0 }}>
            <Button sx={{ flexShrink: 0 }} variant="outline">
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
