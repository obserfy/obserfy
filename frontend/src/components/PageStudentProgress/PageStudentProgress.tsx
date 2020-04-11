import React, { FC, useState } from "react"
import { useGetStudent } from "../../api/useGetStudent"
import Box from "../Box/Box"
import Typography from "../Typography/Typography"
import { BackNavigation } from "../BackNavigation/BackNavigation"
import { useGetArea } from "../../api/useGetArea"
import { Subject, useGetAreaSubjects } from "../../api/useGetAreaSubjects"
import {
  Material,
  useGetSubjectMaterials,
} from "../../api/useGetSubjectMaterials"
import Card from "../Card/Card"
import Flex from "../Flex/Flex"
import Spacer from "../Spacer/Spacer"
import Icon from "../Icon/Icon"
import { ReactComponent as NextIcon } from "../../icons/next-arrow.svg"
import {
  MaterialProgress,
  materialStageToString,
  useGetStudentMaterialProgress,
} from "../../api/useGetStudentMaterialProgress"
import Pill from "../Pill/Pill"
import StudentMaterialProgressDialog from "../StudentMaterialProgressDialog/StudentMaterialProgressDialog"
import LoadingPlaceholder from "../LoadingPlaceholder/LoadingPlaceholder"

interface Props {
  studentId: string
  areaId: string
}
export const PageStudentProgress: FC<Props> = ({ areaId, studentId }) => {
  const area = useGetArea(areaId)
  const student = useGetStudent(studentId)
  const subjects = useGetAreaSubjects(areaId)
  const [isEditing, setIsEditing] = useState(false)
  const [selectedMaterial, setSelectedMaterial] = useState<Material>()
  const progress = useGetStudentMaterialProgress(studentId)
  const loading =
    student.status === "loading" ||
    area.status === "loading" ||
    subjects.status === "loading" ||
    progress.status === "loading"

  const backNavigation = (
    <BackNavigation
      text="Student Details"
      to={`/dashboard/observe/students/details?id=${studentId}`}
    />
  )

  if (loading) {
    return (
      <Box maxWidth="maxWidth.sm" m={[3, "auto"]}>
        {backNavigation}
        <LoadingPlaceholder width="100%" height="6rem" mb={2} mt={4} />
        <LoadingPlaceholder width="100%" height="6rem" mb={4} />
        <LoadingPlaceholder width="100%" height="6rem" mb={2} />
        <LoadingPlaceholder width="100%" height="6rem" mb={2} />
        <LoadingPlaceholder width="100%" height="6rem" mb={2} />
        <LoadingPlaceholder width="100%" height="6rem" mb={2} />
      </Box>
    )
  }

  const selectedProgress = progress.data?.find(
    ({ materialId }) => materialId === selectedMaterial?.id
  )

  return (
    <>
      <Box maxWidth="maxWidth.sm" margin="auto" pb={5}>
        {backNavigation}
        <Box m={3} mb={4}>
          <Typography.H3 sx={{ wordWrap: "break-word" }}>
            <Box as="span" color="textDisabled">
              {student.data?.name}
            </Box>
            {` ${area.data?.name} Progress`}
          </Typography.H3>
        </Box>
        <Box m={3}>
          {subjects.data?.map((subject) => (
            <Box mb={4} key={subject.id}>
              <Typography.H5 my={3}>{subject.name}</Typography.H5>
              <SubjectMaterials
                subject={subject}
                progress={progress.data ?? []}
                onMaterialClick={(material) => {
                  setSelectedMaterial(material)
                  setIsEditing(true)
                }}
              />
            </Box>
          ))}
        </Box>
      </Box>
      {isEditing && (
        <StudentMaterialProgressDialog
          studentId={studentId}
          stage={selectedProgress?.stage}
          lastUpdated={selectedProgress?.updatedAt}
          materialName={selectedMaterial?.name ?? ""}
          materialId={selectedMaterial?.id ?? ""}
          onDismiss={() => setIsEditing(false)}
          onSubmitted={() => {
            progress.refetch()
            setIsEditing(false)
          }}
        />
      )}
    </>
  )
}

const SubjectMaterials: FC<{
  subject: Subject
  progress: MaterialProgress[]
  onMaterialClick: (material: Material) => void
}> = ({ progress, subject, onMaterialClick }) => {
  const materials = useGetSubjectMaterials(subject.id)

  if (materials.status === "loading") {
    return (
      <>
        <LoadingPlaceholder width="100%" height="6rem" mb={2} />
        <LoadingPlaceholder width="100%" height="6rem" mb={2} />
        <LoadingPlaceholder width="100%" height="6rem" mb={2} />
        <LoadingPlaceholder width="100%" height="6rem" mb={2} />
        <LoadingPlaceholder width="100%" height="6rem" mb={2} />
        <LoadingPlaceholder width="100%" height="6rem" mb={2} />
      </>
    )
  }

  return (
    <>
      {materials.data?.map((material) => {
        const match = progress.find((item) => item.materialId === material.id)
        const stage = materialStageToString(match?.stage)
        return (
          <Card
            key={material.id}
            my={2}
            p={3}
            sx={{ cursor: "pointer" }}
            onClick={() => onMaterialClick(material)}
          >
            <Flex alignItems="center">
              <Flex flexDirection="column" alignItems="start">
                <Typography.H6>{material.name}</Typography.H6>
                {stage && (
                  <Pill
                    text={stage}
                    color={`materialStage.on${stage}`}
                    backgroundColor={`materialStage.${stage.toLocaleLowerCase()}`}
                    mt={2}
                  />
                )}
              </Flex>
              <Spacer />
              <Icon as={NextIcon} m={0} />
            </Flex>
          </Card>
        )
      })}
    </>
  )
}

export default PageStudentProgress
