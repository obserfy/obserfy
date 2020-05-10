/** @jsx jsx */
import { FC, Fragment, useState } from "react"
import { navigate } from "gatsby"
import { jsx } from "theme-ui"
import { Link } from "../Link/Link"
import { useGetStudent } from "../../api/useGetStudent"
import Flex from "../Flex/Flex"
import Box from "../Box/Box"
import Typography from "../Typography/Typography"
import Icon from "../Icon/Icon"
import EmptyListPlaceholder from "../EmptyListPlaceholder/EmptyListPlaceholder"
import Button from "../Button/Button"
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
import { ALL_OBSERVATIONS_PAGE_URL } from "../../routes"
import dayjs from "../../dayjs"

interface Props {
  id: string
}
export const PageStudentDetails: FC<Props> = ({ id }) => {
  const [isEditingObservation, setIsEditingObservation] = useState(false)
  const [isDeletingObservation, setIsDeletingObservation] = useState(false)
  const [targetObservation, setTargetObservation] = useState<Observation>()
  const [selectedDate, setSelectedDate] = useState(0)
  const student = useGetStudent(id)
  const observations = useGetObservations(id)

  const dates = [
    ...new Set(
      observations.data?.map(({ createdDate }) =>
        dayjs(createdDate ?? "")
          .startOf("day")
          .toISOString()
      )
    ),
  ]?.sort((a, b) => dayjs(b).diff(a))

  const selectedDateDifference = Math.floor(
    dayjs.duration(dayjs(dates?.[selectedDate] ?? "").diff(dayjs())).asDays()
  )

  const listOfObservations = observations.data
    ?.filter((observation) =>
      dayjs(observation.createdDate ?? "").isSame(dates[selectedDate], "day")
    )
    ?.sort((a, b) => {
      return parseInt(a.categoryId, 10) - parseInt(b.categoryId, 10)
    })
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

  const emptyObservationPlaceholder = observations.status !== "loading" &&
    (observations.data ?? []).length === 0 && (
      <EmptyListPlaceholder
        mx={[0, 3]}
        borderRadius={[0, "default"]}
        text="No observation have been added yet"
        callToActionText="new observation"
        onActionClick={() =>
          navigate(
            `/dashboard/observe/students/observations/new?studentId=${id}`
          )
        }
      />
    )

  const dateSelector = (observations.data?.length ?? 0) > 0 && (
    <Flex alignItems="center" px={3} mb={3}>
      <Typography.Body
        fontSize={1}
        color="textMediumEmphasis"
        sx={{ textTransform: "capitalize" }}
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
      <Link to={ALL_OBSERVATIONS_PAGE_URL(id)}>
        <Button variant="outline" py={1} px={3}>
          All
        </Button>
      </Link>
    </Flex>
  )

  return (
    <Fragment>
      <Box maxWidth="maxWidth.sm" margin="auto" pb={5}>
        <BackNavigation text="Home" to="/dashboard/observe" />
        <Flex alignItems="start" mx={3} mb={4} mt={0}>
          <Typography.H4 sx={{ wordWrap: "break-word" }} lineHeight={1.4}>
            {student.data?.name || (
              <LoadingPlaceholder width="24rem" height={60} />
            )}
          </Typography.H4>
          <Spacer />
        </Flex>
        <Flex m={3} mb={2}>
          <Link
            sx={{ mr: 2 }}
            to={`/dashboard/observe/students/profile?id=${id}`}
          >
            <Button data-cy="edit" minWidth={43} variant="outline">
              See Profile
            </Button>
          </Link>
          <Link
            sx={{ width: "100%" }}
            to={`/dashboard/observe/students/observations/new?studentId=${id}`}
          >
            <Button sx={{ width: "100%" }}>
              <Icon as={PlusIcon} m={0} mr={2} fill="onPrimary" />
              Add Observation
            </Button>
          </Link>
        </Flex>
        <Typography.H6 mr="auto" lineHeight={1} pt={4} pl={3} pr={2} mb={1}>
          Observations
        </Typography.H6>
        {emptyObservationPlaceholder}
        {dateSelector}
        <Box mx={[0, 3]}>
          {listOfObservations}
          {observations.status === "loading" && !observations.data && (
            <ObservationLoadingPlaceholder />
          )}
        </Box>
        <Box py={3} mb={1}>
          <StudentProgressSummaryCard studentId={id} />
        </Box>
      </Box>
      {isEditingObservation && (
        <EditObservationDialog
          defaultValue={targetObservation}
          onDismiss={() => setIsEditingObservation(false)}
          onSaved={async () => {
            await observations.refetch()
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
            await observations.refetch()
            setIsDeletingObservation(false)
          }}
        />
      )}
    </Fragment>
  )
}

const ObservationLoadingPlaceholder: FC = () => (
  <Box>
    <LoadingPlaceholder
      width="100%"
      height={116}
      mb={2}
      sx={{ borderRadius: [0, "default"] }}
    />
    <LoadingPlaceholder
      width="100%"
      height={116}
      mb={2}
      sx={{ borderRadius: [0, "default"] }}
    />
    <LoadingPlaceholder
      width="100%"
      height={116}
      mb={2}
      sx={{ borderRadius: [0, "default"] }}
    />
  </Box>
)

export default PageStudentDetails
