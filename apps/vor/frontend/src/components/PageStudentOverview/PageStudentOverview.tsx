/** @jsx jsx */
import { FC, Fragment, useState } from "react"
import { navigate } from "gatsby"
import { Box, Button, Flex, Image, jsx } from "theme-ui"
import { Link } from "../Link/Link"
import { useGetStudent } from "../../api/useGetStudent"
import Typography from "../Typography/Typography"
import Icon from "../Icon/Icon"
import EmptyListPlaceholder from "../EmptyListPlaceholder/EmptyListPlaceholder"
import LoadingPlaceholder from "../LoadingPlaceholder/LoadingPlaceholder"
import {
  Observation,
  useGetStudentObservations,
} from "../../api/useGetStudentObservations"
import EditObservationDialog from "../EditObservationDialog/EditObservationDialog"
import DeleteObservationDialog from "../DeleteObservationDialog/DeleteObservationDialog"
import ObservationCard from "../ObservationCard/ObservationCard"
import StudentProgressSummaryCard from "../StudentProgressSummaryCard/StudentProgressSummaryCard"
import { ReactComponent as NextIcon } from "../../icons/next-arrow.svg"
import { ReactComponent as PrevIcon } from "../../icons/arrow-back.svg"
import { ReactComponent as PlusIcon } from "../../icons/plus.svg"
import { ReactComponent as ImageIcon } from "../../icons/image.svg"
import { ReactComponent as CalendarIcon } from "../../icons/calendar.svg"
import { ReactComponent as PersonIcon } from "../../icons/person.svg"
import {
  ALL_OBSERVATIONS_PAGE_URL,
  NEW_OBSERVATION_URL,
  STUDENT_IMAGES_URL,
  STUDENT_PLANS_URL,
  STUDENT_PROFILE_URL,
  STUDENTS_URL,
} from "../../routes"
import dayjs from "../../dayjs"
import StudentPicturePlaceholder from "../StudentPicturePlaceholder/StudentPicturePlaceholder"
import Breadcrumb from "../Breadcrumb/Breadcrumb"
import BreadcrumbItem from "../Breadcrumb/BreadcrumbItem"
import BackButton from "../BackButton/BackButton"

interface Props {
  id: string
}
export const PageStudentOverview: FC<Props> = ({ id }) => {
  const student = useGetStudent(id)
  return (
    <Fragment>
      <Box sx={{ maxWidth: "maxWidth.sm" }} margin="auto" pb={5}>
        <Flex sx={{ height: 48, alignItems: "center" }}>
          <BackButton to={STUDENTS_URL} />
          <Breadcrumb>
            <BreadcrumbItem to={STUDENTS_URL}>Students</BreadcrumbItem>
            <BreadcrumbItem>{student.data?.name.split(" ")[0]}</BreadcrumbItem>
          </Breadcrumb>
        </Flex>
        <Flex sx={{ alignItems: "center" }} mx={3}>
          <Box sx={{ flexShrink: 0 }}>
            {student.data?.profilePic ? (
              <Image
                src={student.data?.profilePic}
                sx={{ width: 32, height: 32, borderRadius: "circle" }}
              />
            ) : (
              <StudentPicturePlaceholder />
            )}
          </Box>
          <Typography.H6
            ml={3}
            mb={2}
            sx={{ wordWrap: "break-word", fontWeight: "bold", lineHeight: 1.4 }}
          >
            {student.data?.name || (
              <LoadingPlaceholder sx={{ width: "12rem", height: 28 }} />
            )}
          </Typography.H6>
        </Flex>
        <Flex mx={3} my={2}>
          <Link sx={{ mr: 2, flexGrow: 1 }} to={STUDENT_PROFILE_URL(id)}>
            <Button data-cy="edit" variant="outline" sx={{ width: "100%" }}>
              <Icon as={PersonIcon} fill="textPrimary" mr={2} />
              Profile
            </Button>
          </Link>
          <Link sx={{ mr: 2, flexGrow: 1 }} to={STUDENT_PLANS_URL(id)}>
            <Button data-cy="edit" variant="outline" sx={{ width: "100%" }}>
              <Icon as={CalendarIcon} fill="textPrimary" mr={2} />
              Plans
            </Button>
          </Link>
          <Link sx={{ flexGrow: 1 }} to={STUDENT_IMAGES_URL(id)}>
            <Button data-cy="edit" variant="outline" sx={{ width: "100%" }}>
              <Icon as={ImageIcon} fill="textPrimary" mr={2} />
              Gallery
            </Button>
          </Link>
        </Flex>
        <Flex m={3} my={2}>
          <Link sx={{ width: "100%" }} to={NEW_OBSERVATION_URL(id)}>
            <Button sx={{ width: "100%" }}>
              <Icon as={PlusIcon} mr={2} fill="onPrimary" />
              Observation
            </Button>
          </Link>
        </Flex>

        <ObservationSection studentId={id} />

        <Typography.H6 px={3} pt={4} pb={3} sx={{ fontWeight: "bold" }}>
          Curriculum Progress
        </Typography.H6>
        <Box mx={[0, 3]}>
          <StudentProgressSummaryCard studentId={id} />
        </Box>
      </Box>
    </Fragment>
  )
}

const ObservationSection: FC<{ studentId: string }> = ({ studentId }) => {
  const { data, status, refetch } = useGetStudentObservations(studentId)
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
        my={3}
        sx={{ borderRadius: [0, "default"] }}
        text="No observation have been added yet"
        callToActionText="new observation"
        onActionClick={() => navigate(NEW_OBSERVATION_URL(studentId))}
      />
    )

  const dateSelector = (data?.length ?? 0) > 0 && (
    <Flex ml="auto">
      <Button
        disabled={selectedDate >= dates.length - 1}
        onClick={() => setSelectedDate(selectedDate + 1)}
        variant="outline"
        py={1}
        px={1}
        mr={1}
      >
        <Icon as={PrevIcon} />
      </Button>
      <Button
        disabled={selectedDate < 1}
        onClick={() => setSelectedDate(selectedDate - 1)}
        variant="outline"
        mr={2}
        py={1}
        px={1}
      >
        <Icon as={NextIcon} />
      </Button>
      <Link
        sx={{ display: "inline-block" }}
        to={ALL_OBSERVATIONS_PAGE_URL(studentId)}
      >
        <Button variant="outline" py={1} px={3} sx={{ height: 30 }}>
          All
        </Button>
      </Link>
    </Flex>
  )

  return (
    <Fragment>
      <Flex sx={{ alignItems: "flex-end" }} pt={4} px={3} mb={2}>
        <Box>
          <Typography.H6 mr="auto" sx={{ fontWeight: "bold" }} mb={1}>
            Observations
          </Typography.H6>
          {(data?.length ?? 0) > 0 && (
            <Typography.Body
              sx={{ fontSize: [1, 1], lineHeight: 1 }}
              color="textMediumEmphasis"
              mb={2}
            >
              {selectedDateDifference !== -1
                ? dayjs(dates?.[selectedDate] ?? "").format("dddd, D MMM 'YY")
                : `Today, ${dayjs(dates?.[selectedDate] ?? "").format(
                    "D MMM 'YY"
                  )}`}
            </Typography.Body>
          )}
        </Box>
        {dateSelector}
      </Flex>
      <Box mx={[0, 3]}>
        {emptyObservationPlaceholder}
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
