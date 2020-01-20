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
  materialStageToString,
  StudentMaterialProgress,
  useGetStudentMaterialProgress,
} from "../../api/useGetStudentMaterialProgress"
import Pill from "../Pill/Pill"
import StudentMaterialProgressDialog from "../StudentMaterialProgressDialog/StudentMaterialProgressDialog"

interface Props {
  studentId: string
  areaId: string
}
export const PageStudentProgress: FC<Props> = ({ areaId, studentId }) => {
  const [student] = useGetStudent(studentId)
  const [area] = useGetArea(areaId)
  const [subjects] = useGetAreaSubjects(areaId)
  const [progress] = useGetStudentMaterialProgress(studentId)
  const [isEditing, setIsEditing] = useState(false)
  const [selectedMaterial, setSelectedMaterial] = useState<Material>()

  return (
    <>
      <Box maxWidth="maxWidth.sm" margin="auto" pb={5}>
        <BackNavigation
          text="Student Details"
          to={`/dashboard/students/details?id=${studentId}`}
        />
        <Box m={3} mb={4}>
          <Typography.H3 sx={{ wordWrap: "break-word" }}>
            <Box as="span" color="textDisabled">
              {student?.name}
            </Box>
            {` ${area?.name} Progress`}
          </Typography.H3>
        </Box>
        <Box m={3}>
          {subjects?.map(subject => (
            <Box mb={4}>
              <Typography.H5 my={3}>{subject.name}</Typography.H5>
              <SubjectMaterials
                subject={subject}
                progress={progress}
                onMaterialClick={material => {
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
          onDismiss={() => setIsEditing(false)}
          material={selectedMaterial}
          progress={progress.find(
            ({ materialId }) => materialId === selectedMaterial?.id
          )}
        />
      )}
    </>
  )
}

const SubjectMaterials: FC<{
  subject: Subject
  progress: StudentMaterialProgress[]
  onMaterialClick: (material: Material) => void
}> = ({ progress, subject, onMaterialClick }) => {
  const [materials] = useGetSubjectMaterials(subject.id)

  return (
    <>
      {materials.map(material => {
        const match = progress.find(item => item.materialId === material.id)
        const stage = materialStageToString(match?.stage)
        return (
          <Card
            my={2}
            p={3}
            sx={{ cursor: "pointer" }}
            onClick={() => onMaterialClick(material)}
          >
            <Flex alignItems="center">
              <Typography.H6>{material.name}</Typography.H6>
              <Spacer />
              {stage && <Pill text={stage} color="white" />}
              <Icon as={NextIcon} m={0} />
            </Flex>
          </Card>
        )
      })}
    </>
  )
}

export default PageStudentProgress
