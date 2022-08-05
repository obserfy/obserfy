import { t, Trans } from "@lingui/macro"
import { FC, memo, ReactNode, useState } from "react"
import { Box, Button, Card, Flex } from "theme-ui"
import { borderBottom, borderFull } from "../../border"
import dayjs, { Dayjs } from "../../dayjs"
import { exportStudentObservations } from "../../export"
import { useGetCurriculumAreas } from "../../hooks/api/useGetCurriculumAreas"
import {
  Observation,
  useGetStudentObservations,
} from "../../hooks/api/useGetStudentObservations"
import useDebounce from "../../hooks/useDebounce"
import useVisibilityState from "../../hooks/useVisibilityState"
import { ReactComponent as CalendarIcon } from "../../icons/calendar.svg"
import { OBSERVATION_DETAILS_URL } from "../../routes"
import AlertDialog from "../AlertDialog/AlertDialog"
import DatePickerDialog from "../DatePickerDialog/DatePickerDialog"
import Icon from "../Icon/Icon"
import LoadingPlaceholder from "../LoadingPlaceholder/LoadingPlaceholder"
import ObservationListItem from "../ObservationListItem/ObservationListItem"
import SearchBar from "../SearchBar/SearchBar"
import Tab from "../Tab/Tab"
import Typography from "../Typography/Typography"

export const ObservationsTable: FC<{
  studentId: string
  studentName: string
}> = ({ studentId, studentName }) => {
  const [searchTerm, setSearchTerm] = useState("")
  const [startDate, setStartDate] = useState<Dayjs>()
  const [endDate, setEndDate] = useState<Dayjs>()

  const debouncedSearchTerm = useDebounce(searchTerm, 250)

  const observations = useGetStudentObservations(
    studentId,
    debouncedSearchTerm,
    startDate,
    endDate
  )
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

  const dates = observations.data?.map(
    (observation) => observation.eventTime
  ) ?? [undefined, undefined]

  return (
    <>
      <Flex p={3} sx={{ alignItems: "flex-end" }}>
        <Typography.H5 sx={{ lineHeight: 1 }}>
          <Trans>Observations </Trans>
        </Typography.H5>

        <ExportButton
          studentId={studentId}
          search={searchTerm}
          startDate={startDate || dayjs(dates[0])}
          endDate={endDate || dayjs(dates[dates.length - 1])}
          studentName={studentName}
        />
      </Flex>

      <Card variant="responsive">
        <Flex px={3} pt={3}>
          <SearchBar
            mr={3}
            sx={{ backgroundColor: "darkSurface", height: 40 }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {observations.isSuccess && (
            <DateRangeSelector
              startDate={startDate || dayjs(dates[0])}
              endDate={endDate || dayjs(dates[dates.length - 1])}
              onStartDateChange={setStartDate}
              onEndDateChange={setEndDate}
            />
          )}
          {observations.isLoading && (
            <LoadingPlaceholder
              sx={{ width: 245, height: 40, flexShrink: 0 }}
            />
          )}
        </Flex>

        <Tab
          small
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
    </>
  )
}

const ExportButton: FC<{
  studentId: string
  search: string | ""
  startDate: dayjs.Dayjs
  endDate: dayjs.Dayjs
  studentName: string
}> = ({ studentId, search, startDate, endDate, studentName }) => {
  const exportDialog = useVisibilityState()

  const handleExport = async () => {
    await exportStudentObservations(
      studentId,
      startDate,
      endDate,
      search,
      studentName
    )
    exportDialog.hide()
  }

  return (
    <>
      <Button ml="auto" onClick={exportDialog.show}>
        <Trans>Export</Trans>
      </Button>
      {exportDialog.visible && (
        <AlertDialog
          title={t`Export Observations`}
          body={t`This will export all currently visible observations as a csv file, continue?`}
          onNegativeClick={exportDialog.hide}
          onPositiveClick={handleExport}
        />
      )}
    </>
  )
}

const DateRangeSelector: FC<{
  startDate: dayjs.Dayjs
  endDate: dayjs.Dayjs
  onStartDateChange: (date: Dayjs) => void
  onEndDateChange: (date: Dayjs) => void
}> = ({ startDate, endDate, onStartDateChange, onEndDateChange }) => {
  const startDateDialog = useVisibilityState()
  const endDateDialog = useVisibilityState()

  return (
    <>
      <Flex
        mr="auto"
        sx={{
          flexShrink: 0,
          alignItems: "center",
          borderRadius: "default",
          backgroundColor: "darkSurface",
          ...borderFull,
        }}
      >
        <Icon as={CalendarIcon} ml={2} sx={{ display: ["none", "block"] }} />
        <Button
          variant="text"
          color="textMediumEmphasis"
          px={2}
          m={1}
          onClick={startDateDialog.show}
        >
          {startDate.format("D MMM YYYY")}
        </Button>
        <Box mb={1}>-</Box>
        <Button
          variant="text"
          color="textMediumEmphasis"
          px={2}
          m={1}
          onClick={endDateDialog.show}
        >
          {endDate.format("D MMM YYYY")}
        </Button>
      </Flex>

      {startDateDialog.visible && (
        <DatePickerDialog
          title={t`Pick start date`}
          defaultDate={startDate}
          onDismiss={startDateDialog.hide}
          onConfirm={(date) => {
            onStartDateChange(date)
            startDateDialog.hide()
          }}
        />
      )}

      {endDateDialog.visible && (
        <DatePickerDialog
          title={t`Pick end date`}
          defaultDate={endDate}
          onDismiss={endDateDialog.hide}
          onConfirm={(date) => {
            onEndDateChange(date)
            endDateDialog.hide()
          }}
        />
      )}
    </>
  )
}

const ObservationList: FC<{
  studentId: string
  observations: Observation[]
}> = memo(({ observations, studentId }) => {
  const observationsByDate: { [key: number]: ReactNode[] } = {}

  observations.forEach((observation) => {
    const date = dayjs(observation.eventTime).startOf("day").unix()
    observationsByDate[date] ??= []
    observationsByDate[date].push(
      <ObservationListItem
        key={observation.id}
        observation={observation}
        detailsUrl={OBSERVATION_DETAILS_URL(studentId, observation.id)}
        studentId={studentId}
      />
    )
  })

  const dates = Object.keys(observationsByDate).reverse()

  return (
    <Box>
      {observations.length === 0 && (
        <Typography.Body p={3}>
          <Trans>No observations found</Trans>
        </Typography.Body>
      )}

      {dates.map((date) => {
        const dateUnix = parseInt(date, 10)
        return (
          <Box key={date}>
            <Typography.Body
              py={2}
              sx={{
                ...borderBottom,
                borderColor: "borderSolid",
                textAlign: "center",
                backgroundColor: "darkSurface",
                position: "sticky",
                top: 0,
                zIndex: 100,
              }}
            >
              {dayjs.unix(dateUnix).format("D MMMM YYYY")}
            </Typography.Body>

            {observationsByDate[dateUnix]}
          </Box>
        )
      })}
    </Box>
  )
})

const LoadingState = () => (
  <Box p={3}>
    <LoadingPlaceholder mb={3} sx={{ width: "100%", height: "2rem" }} />
    <LoadingPlaceholder mb={3} sx={{ width: "100%", height: "5rem" }} />
    <LoadingPlaceholder mb={3} sx={{ width: "100%", height: "5rem" }} />
    <LoadingPlaceholder mb={3} sx={{ width: "100%", height: "5rem" }} />
    <LoadingPlaceholder sx={{ width: "100%", height: "5rem" }} />
  </Box>
)
