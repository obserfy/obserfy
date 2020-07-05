/** @jsx jsx */
import { FC, Fragment, useState } from "react"
import { navigate } from "gatsby"
import { Box, Button, Flex, jsx } from "theme-ui"
import { Link } from "../Link/Link"
import { useGetStudent } from "../../api/useGetStudent"

import Typography from "../Typography/Typography"
import Icon from "../Icon/Icon"
import EmptyListPlaceholder from "../EmptyListPlaceholder/EmptyListPlaceholder"

import { BackNavigation } from "../BackNavigation/BackNavigation"
import LoadingPlaceholder from "../LoadingPlaceholder/LoadingPlaceholder"
import { Observation, useGetObservations } from "../../api/useGetObservations"
import EditObservationDialog from "../EditObservationDialog/EditObservationDialog"
import DeleteObservationDialog from "../DeleteObservationDialog/DeleteObservationDialog"
import ObservationCard from "../ObservationCard/ObservationCard"
import Spacer from "../Spacer/Spacer"
import StudentProgressSummaryCard from "../StudentProgressSummaryCard/StudentProgressSummaryCard"
import { ReactComponent as NextIcon } from "../../icons/next-arrow.svg"
import { ReactComponent as PrevIcon } from "../../icons/arrow-back.svg"
import { ReactComponent as PlusIcon } from "../../icons/plus.svg"
import {
  ALL_OBSERVATIONS_PAGE_URL,
  NEW_OBSERVATION_URL,
  STUDENT_PLANS_URL,
  STUDENT_PROFILE_URL,
} from "../../routes"
import dayjs from "../../dayjs"

interface Props {
  id: string
}
export const PageStudentOverview: FC<Props> = ({ id }) => {
  const student = useGetStudent(id)
  return (
    <Fragment>
      <Box sx={{ maxWidth: "maxWidth.sm" }} margin="auto" pb={5}>
        <BackNavigation text="Home" to="/dashboard/observe" />
        <Flex sx={{ alignItems: "start" }} mx={3} mb={4} mt={0}>
          <Typography.H4 sx={{ wordWrap: "break-word", lineHeight: 1.6 }}>
            {student.data?.name || (
              <LoadingPlaceholder sx={{ width: "24rem", height: 60 }} />
            )}
          </Typography.H4>
          <Spacer />
        </Flex>
        <Flex m={3} mb={2}>
          <Link sx={{ mr: 2 }} to={STUDENT_PROFILE_URL(id)}>
            <Button data-cy="edit" sx={{ minWidth: 43 }} variant="outline">
              Profile
            </Button>
          </Link>
          <Link sx={{ mr: 2 }} to={STUDENT_PLANS_URL(id)}>
            <Button data-cy="edit" sx={{ minWidth: 43 }} variant="outline">
              Plans
            </Button>
          </Link>
          <Link sx={{ width: "100%" }} to={NEW_OBSERVATION_URL(id)}>
            <Button sx={{ width: "100%" }}>
              <Icon as={PlusIcon} m={0} mr={2} fill="onPrimary" />
              Observation
            </Button>
          </Link>
        </Flex>
        <ObservationSection studentId={id} />
        <StudentProgressSummaryCard studentId={id} />
      </Box>
    </Fragment>
  )
}

const ObservationSection: FC<{ studentId: string }> = ({ studentId }) => {
  const { data, status, refetch } = useGetObservations(studentId)
  const [targetObservation, setTargetObservation] = useState<Observation>()
  const [selectedDate, setSelectedDate] = useState(0)
  const [isEditingObservation, setIsEditingObservation] = useState(false)
  const [isDeletingObservation, setIsDeletingObservation] = useState(false)

  const dates = [
    ...new Set(
      data?.map(({ createdDate }) =>
        dayjs(createdDate ?? "")
          .startOf("day")
          .toISOString()
      )
    ),
  ]?.sort((a, b) => dayjs(b).diff(a))

  const selectedDateDifference = Math.floor(
    dayjs.duration(dayjs(dates?.[selectedDate] ?? "").diff(dayjs())).asDays()
  )

  const listOfObservations = data
    ?.filter((observation) =>
      dayjs(observation.createdDate ?? "").isSame(dates[selectedDate], "day")
    )
    ?.sort((a, b) => parseInt(a.categoryId, 10) - parseInt(b.categoryId, 10))
    ?.map((observation) => (
      <ObservationCard
        key={observation.id}
        observation={observation}
        onDelete={(value) => {
          setTargetObservation(value)
          setIsDeletingObservation(true)
        }}
        onEdit={(value) => {
          setTargetObservation(value)
          setIsEditingObservation(true)
        }}
      />
    ))

  const emptyObservationPlaceholder = status !== "loading" &&
    (data ?? []).length === 0 && (
      <EmptyListPlaceholder
        mx={[0, 3]}
        my={3}
        sx={{ borderRadius: [0, "default"] }}
        text="No observation have been added yet"
        callToActionText="new observation"
        onActionClick={() => navigate(NEW_OBSERVATION_URL(studentId))}
      />
    )

  const dateSelector = (data?.length ?? 0) > 0 && (
    <Flex sx={{ alignItems: "center" }} px={3} mb={2}>
      <Typography.Body
        color="textMediumEmphasis"
        sx={{ fontSize: 1, textTransform: "capitalize" }}
      >
        {/* eslint-disable-next-line no-nested-ternary */}
        {selectedDateDifference > -3
          ? selectedDateDifference === -1
            ? "Today"
            : `${selectedDateDifference * -1} Days`
          : dayjs(dates?.[selectedDate] ?? "").format("dddd, D MMM 'YY")}
      </Typography.Body>
      <Button
        disabled={selectedDate >= dates.length - 1}
        onClick={() => setSelectedDate(selectedDate + 1)}
        variant="outline"
        py={1}
        px={1}
        mr={1}
        ml="auto"
      >
        <Icon as={PrevIcon} m={0} />
      </Button>
      <Button
        disabled={selectedDate < 1}
        onClick={() => setSelectedDate(selectedDate - 1)}
        variant="outline"
        mr={2}
        py={1}
        px={1}
      >
        <Icon as={NextIcon} m={0} />
      </Button>
      <Link to={ALL_OBSERVATIONS_PAGE_URL(studentId)}>
        <Button variant="outline" py={1} px={3}>
          All
        </Button>
      </Link>
    </Flex>
  )

  return (
    <Fragment>
      <Typography.H6 mr="auto" sx={{ lineHeight: 1 }} pt={4} px={3} mb={1}>
        Observations
      </Typography.H6>
      {emptyObservationPlaceholder}
      {dateSelector}
      <Box mx={[0, 3]}>
        {listOfObservations}
        {status === "loading" && !data && <ObservationLoadingPlaceholder />}
      </Box>
      {isEditingObservation && (
        <EditObservationDialog
          defaultValue={targetObservation}
          onDismiss={() => setIsEditingObservation(false)}
          onSaved={async () => {
            await refetch()
            setIsEditingObservation(false)
          }}
        />
      )}
      {isDeletingObservation && targetObservation && (
        <DeleteObservationDialog
          observationId={targetObservation.id ?? ""}
          shortDesc={targetObservation?.shortDesc}
          onDismiss={() => setIsDeletingObservation(false)}
          onDeleted={async () => {
            await refetch()
            setIsDeletingObservation(false)
          }}
        />
      )}
    </Fragment>
  )
}

const ObservationLoadingPlaceholder: FC = () => (
  <Box mt={4}>
    <LoadingPlaceholder
      mb={2}
      sx={{
        height: 116,
        width: "100%",
        borderRadius: [0, "default"],
      }}
    />
    <LoadingPlaceholder
      mb={2}
      sx={{
        height: 116,
        width: "100%",
        borderRadius: [0, "default"],
      }}
    />
    <LoadingPlaceholder
      mb={2}
      sx={{
        height: 116,
        width: "100%",
        borderRadius: [0, "default"],
      }}
    />
  </Box>
)

export default PageStudentOverview
