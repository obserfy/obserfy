import React, { FC } from "react"
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

// FIXME: Typescript any typing, and inconsistent loading state should be fixed.
interface Props {
  id: string
}
export const PageCurriculumArea: FC<Props> = ({ id }) => {
  const area = useGetArea(id)
  const [subjects, subjectsLoading] = useGetAreaSubjects(id)
  const loading = area.loading || subjectsLoading

  const subjectList = subjects?.map(subject => (
    <Box key={subject.id}>
      <SubjectMaterials subject={subject} />
    </Box>
  ))

  return (
    <Box maxWidth="maxWidth.sm" margin="auto">
      <BackNavigation to="/dashboard/settings/curriculum" text="Curriculum" />
      {loading && <LoadingState />}
      <Typography.H3 p={3} pb={2} lineHeight={1}>
        {area.data?.name}
      </Typography.H3>
      <Box m={3} mb={4}>
        <Button variant="outline" width="100%">
          <Icon as={PlusIcon} m={0} mr={2} />
          New Subject
        </Button>
      </Box>
      {!loading && subjectList}
    </Box>
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
    <Card mx={3} my={2} p={3} key={material.id}>
      <Typography.H6>{material.name}</Typography.H6>
    </Card>
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
    <Box mb={3} pb={2}>
      <Flex alignItems="flex-start" m={3}>
        <Typography.H4 lineHeight={1.5}>{subject.name}</Typography.H4>
        <Spacer />
        <Flex height="46px" alignItems="center" sx={{ flexShrink: 0 }}>
          <Button sx={{ flexShrink: 0 }} variant="outline">
            <Icon as={EditIcon} m={0} mr={2} />
            Edit
          </Button>
        </Flex>
      </Flex>
      {loadingPlaceholder}
      {materialList}
    </Box>
  )
}

export default PageCurriculumArea
