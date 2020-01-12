import React, { FC } from "react"
import useApi from "../../api/useApi"
import Box from "../Box/Box"
import Typography from "../Typography/Typography"
import LoadingPlaceholder from "../LoadingPlaceholder/LoadingPlaceholder"
import Card from "../Card/Card"
import BackNavigation from "../BackNavigation/BackNavigation"

// FIXME: Typescript any typing, and inconsistent loading state should be fixed.
interface Props {
  id: string
}
interface Area {
  id: string
  name: string
}
interface Subject {
  id: string
  name: string
  order: string
}
export const PageCurriculumArea: FC<Props> = ({ id }) => {
  const [area, setAreaOutdated, areaLoading] = useApi<Area>(
    `/curriculum/areas/${id}`
  )
  const [subjects, setSubjectsOutdated, subjectsLoading] = useApi<Subject[]>(
    `/curriculum/areas/${id}/subjects`
  )
  const loading = areaLoading || subjectsLoading

  const subjectList = subjects?.map(subject => (
    <Box m={3} key={subject.id}>
      <SubjectMaterials subject={subject} />
    </Box>
  ))

  return (
    <Box maxWidth="maxWidth.sm" margin="auto">
      <BackNavigation to="/dashboard/settings/curriculum" text="Curriculum" />
      {loading && <LoadingState />}
      <Typography.H3 p={3} lineHeight={1}>
        {area?.name}
      </Typography.H3>
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
interface Material {
  id: string
  name: string
  order: number
}
const SubjectMaterials: FC<SubjectProps> = ({ subject }) => {
  const [materials, setMaterialsOutdated, loading] = useApi<Material[]>(
    `/curriculum/subjects/${subject.id}/materials`
  )

  const materialList = materials?.map(material => (
    <Box mx={3} my={2} key={material.id}>
      <Typography.Body>{material.name}</Typography.Body>
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
    <Card mb={3} pb={2}>
      <Typography.H5 m={3} mb={4}>
        {subject.name}
      </Typography.H5>
      {loadingPlaceholder}
      {materialList}
    </Card>
  )
}

export default PageCurriculumArea
