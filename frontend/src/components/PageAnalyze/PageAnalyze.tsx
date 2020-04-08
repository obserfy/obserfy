import React, { FC, useEffect, useState } from "react"
import Box from "../Box/Box"
import Input from "../Input/Input"
import Flex from "../Flex/Flex"
import Button from "../Button/Button"
import Icon from "../Icon/Icon"
import { ReactComponent as FlipIcon } from "../../icons/flip.svg"
import { Student, useGetStudents } from "../../api/students/useGetStudents"
import LoadingPlaceholder from "../LoadingPlaceholder/LoadingPlaceholder"
import Typography from "../Typography/Typography"
import Card from "../Card/Card"
import {
  materialStageToString,
  useGetStudentMaterialProgress,
} from "../../api/useGetStudentMaterialProgress"
import { useGetCurriculumAreas } from "../../api/useGetCurriculumAreas"
import { getAnalytics } from "../../analytics"
import Pill from "../Pill/Pill"
import Spacer from "../Spacer/Spacer"
import { useGetObservations } from "../../api/useGetObservations"
import Dialog from "../Dialog/Dialog"
import { categories } from "../../categories"

// TODO: This page is removed for now. We'll need to rethink how to implement this
export const PageAnalyze: FC = () => {
  const [selectedStudentIdx, setSelectedStudentIdx] = useState(0)
  const [selectedAreaId, setSelectedAreaId] = useState("")
  const [showStudentSelector, setShowStudentSelector] = useState(false)
  const students = useGetStudents()
  const areas = useGetCurriculumAreas()

  useEffect(() => {
    const firstArea = areas.data?.[0].id
    if (areas.error === null && firstArea !== undefined) {
      setSelectedAreaId(firstArea)
    }
  }, [areas.error, areas.data])

  if (students.isFetching) {
    return (
      <Flex m={3}>
        <LoadingPlaceholder width="100%" height={48} mr={2} />
        <LoadingPlaceholder sx={{ flexShrink: 0 }} width={48} height={48} />
      </Flex>
    )
  }

  return (
    <>
      <Box>
        <Flex m={3} mb={0}>
          <Input
            width="100%"
            value={students.data?.[selectedStudentIdx]?.name ?? ""}
            mr={2}
            onClick={() => setShowStudentSelector(true)}
            disabled
            sx={{ "&:disabled": { opacity: 1 } }}
          />
          <Button
            variant="outline"
            onClick={() => setShowStudentSelector(true)}
          >
            <Icon as={FlipIcon} m={0} />
          </Button>
        </Flex>
        <Flex pl={3} pr={2} py={3} flexWrap="wrap">
          {areas.data?.map((area) => {
            const isActive = area.id === selectedAreaId
            return (
              <Box
                key={area.id}
                onClick={() => setSelectedAreaId(area.id)}
                backgroundColor={isActive ? "primary" : "surface"}
                mr={2}
                mb={2}
                px={2}
                sx={{
                  userSelect: "none",
                  cursor: "pointer",
                  borderRadius: "default",
                  borderColor: "border",
                  borderWidth: 1,
                  borderStyle: "solid",
                  whiteSpace: "nowrap",
                  "&:hover": {
                    backgroundColor: isActive ? "primary" : "primaryLightest",
                  },
                }}
              >
                <Typography.Body
                  fontSize={1}
                  color={isActive ? "onPrimary" : "text"}
                >
                  {area.name}
                </Typography.Body>
              </Box>
            )
          })}
        </Flex>
        {students.data?.[selectedStudentIdx]?.id && (
          <Box p={[0, 3]}>
            <MaterialProgressCard
              studentId={students.data?.[selectedStudentIdx]?.id ?? ""}
              areaId={selectedAreaId}
            />
            <ObservationCard
              studentId={students.data?.[selectedStudentIdx]?.id ?? ""}
              areaName={
                areas.data?.find((area) => area.id === selectedAreaId)?.name ??
                ""
              }
            />
          </Box>
        )}
      </Box>
      {showStudentSelector && (
        <SelectStudentDialog
          onDismiss={() => setShowStudentSelector(false)}
          students={students.data ?? []}
          onSelected={(index) => {
            setSelectedStudentIdx(index)
            setShowStudentSelector(false)
          }}
        />
      )}
    </>
  )
}

const MaterialProgressCard: FC<{ studentId: string; areaId: string }> = ({
  studentId,
  areaId,
}) => {
  const areaProgress = useGetStudentMaterialProgress(studentId)

  useEffect(() => {
    if (areaProgress.error) {
      getAnalytics()?.track("Error", {
        error: areaProgress.error,
        data: areaProgress.data,
      })
    }
  }, [areaProgress.data, areaProgress.error])

  if (areaProgress.error) return <Box />

  const selectedAreaProgress = areaProgress.data?.filter(
    (area) => area.areaId === areaId && area.stage !== -1
  )

  if (!selectedAreaProgress?.length) return <Box />

  return (
    <>
      <Box m={3} mb={2}>
        <Typography.H6>PROGRESS</Typography.H6>
      </Box>
      <Card borderRadius={[0, "default"]} mb={[4]} width="100%">
        <Box>
          {selectedAreaProgress?.map((progress) => {
            const stage = materialStageToString(progress.stage)
            return (
              <Box
                key={progress.materialId}
                px={3}
                py={2}
                pr={1}
                sx={{
                  borderBottomColor: "border",
                  borderBottomWidth: 1,
                  borderBottomStyle: "solid",
                }}
              >
                <Flex alignItems="center">
                  <Typography.Body fontSize={1}>
                    {progress.materialName}
                  </Typography.Body>
                  <Spacer />
                  <Pill
                    backgroundColor={`materialStage.${stage.toLowerCase()}`}
                    text={stage}
                    mr={2}
                  />
                </Flex>
              </Box>
            )
          })}
        </Box>
      </Card>
    </>
  )
}

const ObservationCard: FC<{ studentId: string; areaName: string }> = ({
  studentId,
  areaName,
}) => {
  const observations = useGetObservations(studentId)
  const filteredObservation = observations.data?.filter(
    (observation) =>
      categories[observation.categoryId].name.toLowerCase() ===
      areaName.toLocaleLowerCase()
  )

  if ((filteredObservation ?? []).length === 0) return <Box />

  return (
    <>
      <Typography.H6 p={3}>OBSERVATIONS</Typography.H6>
      <Card borderRadius={[0, "default"]} width="100%">
        {filteredObservation?.map((observation) => {
          return (
            <Box
              key={observation.id}
              p={3}
              sx={{
                borderBottomColor: "border",
                borderBottomWidth: 1,
                borderBottomStyle: "solid",
              }}
            >
              <Typography.H6 mb={2}>{observation.shortDesc}</Typography.H6>
              <Typography.Body fontSize={1}>
                {observation.longDesc}
              </Typography.Body>
            </Box>
          )
        })}
      </Card>
    </>
  )
}

const SelectStudentDialog: FC<{
  onDismiss: () => void
  onSelected: (index: number) => void
  students: Student[]
}> = ({ onSelected, onDismiss, students }) => {
  const [search, setSearch] = useState("")
  const [selectedIdx, setSelectedIdx] = useState<number>()

  const matchedStudent = students.filter((student) =>
    student.name.match(new RegExp(search, "i"))
  )

  const header = (
    <Flex
      alignItems="center"
      backgroundColor="surface"
      sx={{
        flexShrink: 0,
        position: "relative",
        borderBottomColor: "border",
        borderBottomWidth: 1,
        borderBottomStyle: "solid",
      }}
    >
      <Typography.H6
        width="100%"
        sx={{
          position: "absolute",
          pointerEvents: "none",
          textAlign: "center",
          alignContent: "center",
        }}
      >
        Select a Student
      </Typography.H6>
      <Button variant="outline" color="danger" m={2} onClick={onDismiss}>
        Cancel
      </Button>
      <Spacer />
      <Button
        m={2}
        disabled={selectedIdx === undefined}
        onClick={() => onSelected(selectedIdx ?? 0)}
      >
        Select
      </Button>
    </Flex>
  )

  return (
    <Dialog>
      {header}
      <Flex flexDirection="column" maxHeight="100vh">
        <Box backgroundColor="background" overflowY="auto" maxHeight="100%">
          <Box>
            <Box px={3} py={2}>
              <Input
                width="100%"
                label="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </Box>
            <Box mb={200}>
              {matchedStudent.map((student) => {
                const studentIdx = students.findIndex(
                  ({ id }) => id === student.id
                )
                const isActive = selectedIdx === studentIdx
                return (
                  <Box
                    onClick={() => setSelectedIdx(studentIdx)}
                    key={student.id}
                    sx={{
                      userSelect: "none",
                      cursor: "pointer",
                      borderBottomColor: "border",
                      borderBottomWidth: 1,
                      borderBottomStyle: "solid",
                      backgroundColor: isActive ? "primary" : "transparent",
                      "&:hover": {
                        backgroundColor: isActive
                          ? "primary"
                          : "primaryLightest",
                      },
                    }}
                  >
                    <Typography.Body
                      px={3}
                      py={2}
                      color={isActive ? "onPrimary" : "text"}
                    >
                      {student.name}
                    </Typography.Body>
                  </Box>
                )
              })}
            </Box>
          </Box>
        </Box>
      </Flex>
    </Dialog>
  )
}
export default PageAnalyze
