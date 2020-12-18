import React, { FC, Fragment, ReactNode, useMemo, useState } from "react"
import { Box, Card } from "theme-ui"
import { borderTop } from "../../border"
import dayjs from "../../dayjs"
import { useGetCurriculumAreas } from "../../hooks/api/useGetCurriculumAreas"
import {
  Observation,
  useGetStudentObservations,
} from "../../hooks/api/useGetStudentObservations"
import { OBSERVATION_DETAILS_URL } from "../../routes"
import LoadingPlaceholder from "../LoadingPlaceholder/LoadingPlaceholder"
import ObservationListItem from "../ObservationListItem/ObservationListItem"
import Tab from "../Tab/Tab"
import Typography from "../Typography/Typography"

export const ObservationsTable: FC<{ studentId: string }> = ({ studentId }) => {
  const observations = useGetStudentObservations(studentId)
  const areas = useGetCurriculumAreas()
  const [areaFilter, setAreaFilter] = useState(0)

  const areaFilterId =
    areaFilter > 0 ? areas.data?.[areaFilter - 1].id ?? "" : ""

  const observationsByArea = {}
  observations.data?.forEach((observation) => {
    const areaId = observation.area?.id ?? "Other"
    observationsByArea[areaId] ??= []
    observationsByArea[areaId].push(observation)
  })

  return (
    <Card variant="responsive">
      <Tab
        items={["All", ...(areas.data?.map((area) => area.name) ?? [])]}
        selectedItemIdx={areaFilter}
        onTabClick={(idx) => {
          setAreaFilter(idx)
        }}
      />
      {observations.isSuccess && (
        <ObservationList
          studentId={studentId}
          observations={
            areaFilter !== 0
              ? observationsByArea[areaFilterId] ?? []
              : observations.data ?? []
          }
        />
      )}

      {observations.isLoading && !observations.data && <LoadingState />}
    </Card>
  )
}

const ObservationList: FC<{
  studentId: string
  observations: Observation[]
}> = ({ observations, studentId }) => {
  const observationsByDate = useMemo(() => {
    const result: { [key: number]: ReactNode[] } = {}

    observations.forEach((observation) => {
      const date = dayjs(observation.eventTime).startOf("day").unix()
      result[date] ??= []
      result[date].push(
        <ObservationListItem
          observation={observation}
          detailsUrl={OBSERVATION_DETAILS_URL(studentId, observation.id)}
          studentId={studentId}
        />
      )
    })
    return result
  }, [observations])

  const dates = Object.keys(observationsByDate).reverse()

  return (
    <Box>
      {dates.map((date) => {
        const dateUnix = parseInt(date, 10)
        return (
          <Fragment key={date}>
            <Typography.Body
              py={2}
              sx={{
                textAlign: "center",
                backgroundColor: "background",
                ...borderTop,
                borderColor: "borderSolid",
              }}
            >
              {dayjs.unix(dateUnix).format("D MMMM YYYY")}
            </Typography.Body>

            {observationsByDate[dateUnix]}
          </Fragment>
        )
      })}
    </Box>
  )
}

const LoadingState = () => {
  return (
    <Box m={3}>
      <LoadingPlaceholder mb={3} sx={{ width: "100%", height: "2rem" }} />
      <LoadingPlaceholder mb={3} sx={{ width: "100%", height: "5rem" }} />
      <LoadingPlaceholder mb={3} sx={{ width: "100%", height: "5rem" }} />
      <LoadingPlaceholder mb={3} sx={{ width: "100%", height: "5rem" }} />
      <LoadingPlaceholder mb={3} sx={{ width: "100%", height: "5rem" }} />
    </Box>
  )
}
