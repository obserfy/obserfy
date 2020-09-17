import React, { FC, Fragment, ReactNode, useMemo, useState } from "react"
import { Box, Flex } from "theme-ui"
import {
  Observation,
  useGetStudentObservations,
} from "../../api/useGetStudentObservations"
import {
  OBSERVATION_DETAILS_URL,
  STUDENT_OVERVIEW_PAGE_URL,
  STUDENTS_URL,
} from "../../routes"
import Chip from "../Chip/Chip"
import Typography from "../Typography/Typography"
import { useGetStudent } from "../../api/useGetStudent"
import LoadingPlaceholder from "../LoadingPlaceholder/LoadingPlaceholder"
import ObservationCard from "../ObservationCard/ObservationCard"
import dayjs from "../../dayjs"
import BackButton from "../BackButton/BackButton"
import Breadcrumb from "../Breadcrumb/Breadcrumb"
import BreadcrumbItem from "../Breadcrumb/BreadcrumbItem"

interface Props {
  studentId: string
}
export const PageAllObservations: FC<Props> = ({ studentId }) => {
  const [selectedArea, setSelectedArea] = useState("")
  const observations = useGetStudentObservations(studentId)
  const student = useGetStudent(studentId)

  const parsedData = useMemo(() => {
    const areaNames: { [key: string]: string } = {}
    const observationsByArea: { [key: string]: Observation[] } = {}
    observations.data?.forEach((observation) => {
      const areaId = observation.area?.id ?? "Other"
      const areaName = observation.area?.name ?? "Other"
      if (observationsByArea[areaId] === undefined) {
        observationsByArea[areaId] = []
      }
      observationsByArea[areaId].push(observation)
      areaNames[areaId] = areaName
    })
    return { areaNames, observationsByArea }
  }, [observations.data])

  return (
    <>
      <Box sx={{ maxWidth: "maxWidth.sm" }} margin="auto">
        <Flex sx={{ height: 48, alignItems: "center" }}>
          <BackButton to={STUDENT_OVERVIEW_PAGE_URL(studentId)} />
          <Breadcrumb>
            <BreadcrumbItem to={STUDENTS_URL}>Students</BreadcrumbItem>
            <BreadcrumbItem to={STUDENT_OVERVIEW_PAGE_URL(studentId)}>
              {student.data?.name.split(" ")[0]}
            </BreadcrumbItem>
            <BreadcrumbItem>Observations</BreadcrumbItem>
          </Breadcrumb>
        </Flex>
        <Flex pl={3} pr={2} py={2} sx={{ flexWrap: "wrap" }}>
          <Chip
            mr={2}
            mb={2}
            isActive={selectedArea === ""}
            activeBackground="primary"
            text={`all (${observations.data?.length ?? 0})`}
            onClick={() => setSelectedArea("")}
          />
          {Object.keys(parsedData.areaNames).map((areaId) => {
            const isSelected = areaId === selectedArea

            return (
              <Chip
                mr={2}
                mb={2}
                key={areaId}
                isActive={areaId === selectedArea}
                activeBackground="primary"
                text={`${parsedData.areaNames[areaId]} (${parsedData.observationsByArea[areaId].length})`}
                onClick={() => {
                  setSelectedArea(isSelected ? "" : areaId)
                }}
              />
            )
          })}
        </Flex>
        {observations.status === "loading" && !observations.data && (
          <Box mb={2} pt={4}>
            <LoadingPlaceholder
              sx={{
                width: "100%",
                height: "5rem",
                borderRadius: [0, "default"],
              }}
              mb={3}
            />
            <LoadingPlaceholder
              sx={{
                width: "100%",
                height: "5rem",
                borderRadius: [0, "default"],
              }}
              mb={3}
            />
            <LoadingPlaceholder
              sx={{
                width: "100%",
                height: "5rem",
                borderRadius: [0, "default"],
              }}
              mb={3}
            />
            <LoadingPlaceholder
              sx={{
                width: "100%",
                height: "5rem",
                borderRadius: [0, "default"],
              }}
              mb={3}
            />
            <LoadingPlaceholder
              sx={{
                width: "100%",
                height: "5rem",
                borderRadius: [0, "default"],
              }}
              mb={3}
            />
          </Box>
        )}
        {observations.isSuccess && (
          <ObservationList
            studentId={studentId}
            observations={
              selectedArea !== ""
                ? parsedData.observationsByArea[selectedArea] ?? []
                : observations.data ?? []
            }
          />
        )}
      </Box>
    </>
  )
}

const ObservationList: FC<{
  studentId: string
  observations: Observation[]
}> = ({ observations, studentId }) => {
  const observationsByDate = useMemo(() => {
    const result: { [key: number]: ReactNode[] } = {}
    observations?.forEach((observation) => {
      const date = dayjs(observation.eventTime).startOf("day").unix()
      if (result[date] === undefined) {
        result[date] = []
      }
      result[date].push(
        <ObservationCard
          key={observation.id}
          detailsUrl={OBSERVATION_DETAILS_URL(studentId, observation.id)}
          observation={observation}
        />
      )
    })
    return result
  }, [observations])

  return (
    <Box m={[0, 3]}>
      {Object.keys(observationsByDate)
        .reverse()
        .map((date) => {
          const dateUnix = parseInt(date, 10)
          return (
            <Fragment key={date}>
              <Typography.Body my={2} sx={{ textAlign: "center", fontSize: 1 }}>
                {dayjs.unix(dateUnix).format("D MMMM YYYY")}
              </Typography.Body>
              {observationsByDate[dateUnix]}
            </Fragment>
          )
        })}
    </Box>
  )
}

export default PageAllObservations
