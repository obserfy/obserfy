import React, { FC, useState } from "react"
import { Box, Card, Flex } from "theme-ui"
import { useGetStudent } from "../../api/useGetStudent"
import Typography from "../Typography/Typography"
import { BackNavigation } from "../BackNavigation/BackNavigation"
import { useGetArea } from "../../api/useGetArea"
import { Subject, useGetAreaSubjects } from "../../api/useGetAreaSubjects"
import {
  Material,
  useGetSubjectMaterials,
} from "../../api/useGetSubjectMaterials"

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
import { STUDENT_OVERVIEW_PAGE_URL, STUDENTS_URL } from "../../routes"
import BackButton from "../BackButton/BackButton"
import Breadcrumb from "../Breadcrumb/Breadcrumb"
import BreadcrumbItem from "../Breadcrumb/BreadcrumbItem"

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
      to={STUDENT_OVERVIEW_PAGE_URL(studentId)}
    />
  )

  if (loading) {
    return (
      <Box sx={{ maxWidth: "maxWidth.sm" }} m={[3, "auto"]}>
        {backNavigation}
        <LoadingPlaceholder
          sx={{ width: "100%", height: "6rem" }}
          mb={2}
          mt={4}
        />
        <LoadingPlaceholder sx={{ width: "100%", height: "6rem" }} mb={4} />
        <LoadingPlaceholder sx={{ width: "100%", height: "6rem" }} mb={2} />
        <LoadingPlaceholder sx={{ width: "100%", height: "6rem" }} mb={2} />
        <LoadingPlaceholder sx={{ width: "100%", height: "6rem" }} mb={2} />
        <LoadingPlaceholder sx={{ width: "100%", height: "6rem" }} mb={2} />
      </Box>
    )
  }

  const selectedProgress = progress.data?.find(
    ({ materialId }) => materialId === selectedMaterial?.id
  )

  return (
    <>
      <Box sx={{ maxWidth: "maxWidth.sm" }} margin="auto" pb={5}>
        <Flex sx={{ height: 48, alignItems: "center" }}>
          <BackButton to={STUDENT_OVERVIEW_PAGE_URL(studentId)} />
          <Breadcrumb>
            <BreadcrumbItem to={STUDENTS_URL}>Students</BreadcrumbItem>
            <BreadcrumbItem to={STUDENT_OVERVIEW_PAGE_URL(studentId)}>
              {student.data?.name.split(" ")[0]}
            </BreadcrumbItem>
            <BreadcrumbItem>{` ${area.data?.name} Progress`}</BreadcrumbItem>
          </Breadcrumb>
        </Flex>
        {subjects.data?.map((subject) => (
          <Card
            mb={4}
            key={subject.id}
            mx={[0, 3]}
            sx={{ borderRadius: [0, "default"] }}
          >
            <Typography.H6 m={3}>{subject.name}</Typography.H6>
            <SubjectMaterials
              subject={subject}
              progress={progress.data ?? []}
              onMaterialClick={(material) => {
                setSelectedMaterial(material)
                setIsEditing(true)
              }}
            />
          </Card>
        ))}
      </Box>
      {isEditing && (
        <StudentMaterialProgressDialog
          studentId={studentId}
          stage={selectedProgress?.stage}
          lastUpdated={selectedProgress?.updatedAt}
          materialName={selectedMaterial?.name ?? ""}
          materialId={selectedMaterial?.id ?? ""}
          onDismiss={() => setIsEditing(false)}
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
        <LoadingPlaceholder sx={{ width: "100%", height: "6rem" }} mb={2} />
        <LoadingPlaceholder sx={{ width: "100%", height: "6rem" }} mb={2} />
        <LoadingPlaceholder sx={{ width: "100%", height: "6rem" }} mb={2} />
        <LoadingPlaceholder sx={{ width: "100%", height: "6rem" }} mb={2} />
        <LoadingPlaceholder sx={{ width: "100%", height: "6rem" }} mb={2} />
        <LoadingPlaceholder sx={{ width: "100%", height: "6rem" }} mb={2} />
      </>
    )
  }

  return (
    <>
      {materials.data?.map((material) => {
        const match = progress.find((item) => item.materialId === material.id)
        const stage = materialStageToString(match?.stage)

        return (
          <Flex
            key={material.id}
            py={2}
            onClick={() => onMaterialClick(material)}
            sx={{
              alignItems: "center",
              cursor: "pointer",
              borderTopColor: "border",
              borderTopWidth: "1px",
              borderTopStyle: "solid",
            }}
          >
            <Typography.Body ml={3} sx={{ fontSize: 1 }} mr="auto">
              {material.name}
            </Typography.Body>
            {stage && (
              <Pill
                mx={2}
                text={stage}
                color={`materialStage.on${stage}`}
                backgroundColor={`materialStage.${stage.toLocaleLowerCase()}`}
              />
            )}
            <Icon as={NextIcon} mr={3} />
          </Flex>
        )
      })}
    </>
  )
}

export default PageStudentProgress
