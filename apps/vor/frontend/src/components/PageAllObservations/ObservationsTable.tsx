import React, { FC, Fragment, ReactNode, useMemo, useState } from "react"

import { Box, Card, Flex } from "theme-ui"
import { borderTop } from "../../border"
import dayjs from "../../dayjs"
import { useGetCurriculumAreas } from "../../hooks/api/useGetCurriculumAreas"
import {
  Observation,
  useGetStudentObservations,
} from "../../hooks/api/useGetStudentObservations"
import { OBSERVATION_DETAILS_URL } from "../../routes"
import ImagePreview from "../ImagePreview/ImagePreview"
import { Link } from "../Link/Link"
import LoadingPlaceholder from "../LoadingPlaceholder/LoadingPlaceholder"
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
        <Link
          to={OBSERVATION_DETAILS_URL(studentId, observation.id)}
          key={observation.id}
        >
          <Box
            pb={3}
            sx={{
              ...borderTop,
              "&:hover": { backgroundColor: "primaryLighter" },
            }}
          >
            <Typography.Body mt={3} mx={3} data-cy="observation-short-desc">
              {observation.shortDesc}
            </Typography.Body>
            {observation.longDesc &&
              observation.longDesc.split("\n\n").map((text) => (
                <Typography.Body
                  key={text}
                  mx={3}
                  mt={2}
                  data-cy="observation-long-desc"
                  color="textMediumEmphasis"
                  sx={{ lineHeight: 1.8 }}
                >
                  {text}
                </Typography.Body>
              ))}

            <Flex>
              {observation.area && (
                <Typography.Body
                  mt={2}
                  ml={3}
                  sx={{ fontSize: 0, lineHeight: 1 }}
                  color="textPrimary"
                >
                  {observation.area.name} {observation.creatorName && "|"}
                </Typography.Body>
              )}
              {observation.creatorName && (
                <Typography.Body
                  mt={2}
                  ml={3}
                  sx={{ fontSize: 0, lineHeight: 1 }}
                  color="textMediumEmphasis"
                >
                  {observation.creatorName}
                </Typography.Body>
              )}
            </Flex>

            {observation.images.length > 0 && (
              <Flex
                sx={{ alignItems: "baseline", flexWrap: "wrap" }}
                mx={3}
                mt={2}
              >
                {observation.images.map(({ id, originalUrl, thumbnailUrl }) => (
                  <ImagePreview
                    key={id}
                    id={id}
                    studentId={studentId}
                    imageId={id}
                    originalUrl={originalUrl}
                    thumbnailUrl={thumbnailUrl}
                    imageSx={{ mr: 2, mt: 2 }}
                  />
                ))}
              </Flex>
            )}
          </Box>
        </Link>
      )
    })
    return result
  }, [observations])

  return (
    <Box>
      {Object.keys(observationsByDate)
        .reverse()
        .map((date) => {
          const dateUnix = parseInt(date, 10)
          return (
            <Fragment key={date}>
              <Typography.Body
                py={2}
                sx={{
                  textAlign: "center",
                  fontSize: 1,
                  backgroundColor: "background",
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
