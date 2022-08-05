import { Trans } from "@lingui/macro"
import { FC, useState } from "react"
import { Box, Button, Card, Flex } from "theme-ui"
import { borderBottom, borderTop } from "../../border"
import dayjs from "../../dayjs"
import {
  Observation,
  useGetStudentObservations,
} from "../../hooks/api/useGetStudentObservations"
import useVisibilityState from "../../hooks/useVisibilityState"
import { ReactComponent as PrevIcon } from "../../icons/arrow-back.svg"
import { ReactComponent as NextIcon } from "../../icons/next-arrow.svg"
import { ReactComponent as PlusIcon } from "../../icons/plus.svg"
import {
  ALL_OBSERVATIONS_PAGE_URL,
  NEW_OBSERVATION_URL,
  STUDENT_OVERVIEWS_OBSERVATION_DETAILS_URL,
} from "../../routes"
import DatePickerDialog from "../DatePickerDialog/DatePickerDialog"
import Icon from "../Icon/Icon"
import { Link, navigate } from "../Link/Link"
import LoadingPlaceholder from "../LoadingPlaceholder/LoadingPlaceholder"
import ObservationListItem from "../ObservationListItem/ObservationListItem"
import Typography from "../Typography/Typography"

const DailyObservationCard: FC<{ studentId: string }> = ({ studentId }) => {
  const datePicker = useVisibilityState()
  const { data, isLoading } = useGetStudentObservations(studentId)
  const [selectionIdx, setSelectionIdx] = useState(0)

  // group observations by date
  const observationsByDate: { [key: number]: Observation[] } = {}
  data?.forEach((observation) => {
    const date = dayjs(observation.eventTime).startOf("day").unix()
    observationsByDate[date] ??= []
    observationsByDate[date].push(observation)
  })

  // get all dates sorted in descending order
  const dates = Object.keys(observationsByDate).sort().reverse()

  const selectedDate = dayjs.unix(parseInt(dates[selectionIdx], 10))
  const observations: Observation[] = observationsByDate[dates[selectionIdx]]
  const dataLength = data?.length ?? 0

  return (
    <Card variant="responsive">
      <Flex sx={{ alignItems: "center" }}>
        <Typography.H6 m={3}>
          <Trans>Observations</Trans>
        </Typography.H6>

        {!isLoading && dataLength !== 0 && (
          <Link
            to={ALL_OBSERVATIONS_PAGE_URL(studentId)}
            sx={{ display: "inline-block", ml: "auto", mr: 3 }}
          >
            <Button variant="text">
              <Trans>See All</Trans>
            </Button>
          </Link>
        )}
      </Flex>

      {!isLoading && dataLength !== 0 && (
        <Flex
          sx={{
            ...borderTop,
            ...borderBottom,
            alignItems: "center",
            backgroundColor: "darkSurface",
            borderColor: "borderSolid",
            position: "sticky",
            top: 0,
            zIndex: 10,
          }}
          py={1}
          px={2}
        >
          <Button
            disabled={selectionIdx >= dates.length - 1}
            onClick={() => setSelectionIdx(selectionIdx + 1)}
            variant="text"
            p={1}
          >
            <Icon as={PrevIcon} />
          </Button>
          <Button
            variant="text"
            color="textMediumEmphasis"
            mx="auto"
            sx={{ fontSize: 0 }}
            onClick={datePicker.show}
          >
            {!selectedDate.isSame(Date.now(), "date")
              ? selectedDate.format("dddd, D MMM YYYY")
              : `Today, ${selectedDate.format("D MMM YYYY")}`}
          </Button>
          <Button
            disabled={selectionIdx < 1}
            onClick={() => setSelectionIdx(selectionIdx - 1)}
            variant="text"
            p={1}
          >
            <Icon as={NextIcon} />
          </Button>
        </Flex>
      )}

      {observations
        ?.sort((a, b) => {
          const firstArea = a.area?.name ?? ""
          const secondArea = b.area?.name ?? ""
          return firstArea.localeCompare(secondArea)
        })
        .map((observation) => (
          <ObservationListItem
            studentId={studentId}
            key={observation.id}
            observation={observation}
            detailsUrl={STUDENT_OVERVIEWS_OBSERVATION_DETAILS_URL(
              studentId,
              observation.id
            )}
          />
        ))}

      {!isLoading && dataLength === 0 && (
        <EmptyState
          onActionClick={() => navigate(NEW_OBSERVATION_URL(studentId))}
        />
      )}

      {isLoading && !data && <LoadingState />}
      {datePicker.visible && (
        <DatePickerDialog
          enabledDates={dates.map((d) => dayjs.unix(parseInt(d, 10)))}
          defaultDate={selectedDate}
          onDismiss={datePicker.hide}
          onConfirm={(date) => {
            const unixDate = date.unix()
            const idx = dates.findIndex((d) => d === unixDate.toString())
            if (idx !== -1) {
              setSelectionIdx(idx)
              datePicker.hide()
            }
          }}
        />
      )}
    </Card>
  )
}

const EmptyState: FC<{
  onActionClick: () => void
}> = ({ onActionClick }) => (
  <Box>
    <Flex
      m={3}
      px={4}
      sx={{
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
      }}
    >
      <Typography.Body mb={4} mt={3} sx={{ textAlign: "center" }}>
        <Trans> No observation have been added yet</Trans>
      </Typography.Body>
      <Button variant="outline" onClick={onActionClick} mb={4}>
        <Icon as={PlusIcon} mr={2} />
        <Trans>Create observation</Trans>
      </Button>
    </Flex>
  </Box>
)

const LoadingState: FC = () => (
  <Box mx={3} pb={2}>
    <LoadingPlaceholder mb={3} sx={{ height: 40, width: "100%" }} />
    <LoadingPlaceholder mb={3} sx={{ height: 21, width: "15%" }} />
    <LoadingPlaceholder mb={3} sx={{ height: 21, width: "25%" }} />
    <LoadingPlaceholder mb={2} sx={{ height: 21, width: "10%" }} />
  </Box>
)

export default DailyObservationCard
