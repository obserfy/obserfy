/** @jsx jsx */
import { FC, Fragment, useMemo, useState } from "react"
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
  STUDENT_OVERVIEWS_OBSERVATION_DETAILS_URL,
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
  const { data, isLoading } = useGetStudentObservations(studentId)
  const [selectionIdx, setSelectionIdx] = useState(0)

  const dataLength = data?.length ?? 0

  const observationsByDate = useMemo(() => {
    const result: { [key: number]: Observation[] } = {}
    data?.forEach((observation) => {
      const date = dayjs(observation.eventTime).startOf("day").unix()
      if (result[date] === undefined) {
        result[date] = []
      }
      result[date].push(observation)
    })
    return result
  }, [data])

  const dates = Object.keys(observationsByDate).sort((a, b) =>
    b.localeCompare(a)
  )

  const selectedDate = dayjs.unix(parseInt(dates[selectionIdx], 10))

  const observations: Observation[] = observationsByDate[dates[selectionIdx]]

  const emptyObservationPlaceholder = !isLoading && dataLength === 0 && (
    <EmptyListPlaceholder
      my={3}
      sx={{ borderRadius: [0, "default"] }}
      text="No observation have been added yet"
      callToActionText="new observation"
      onActionClick={() => navigate(NEW_OBSERVATION_URL(studentId))}
    />
  )

  const dateSelector = dataLength > 0 && (
    <Flex ml="auto">
      <Button
        disabled={selectionIdx >= dates.length - 1}
        onClick={() => setSelectionIdx(selectionIdx + 1)}
        variant="outline"
        py={1}
        px={1}
        mr={1}
      >
        <Icon as={PrevIcon} />
      </Button>
      <Button
        disabled={selectionIdx < 1}
        onClick={() => setSelectionIdx(selectionIdx - 1)}
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
          {dataLength > 0 && (
            <Typography.Body
              sx={{ fontSize: [1, 1], lineHeight: 1 }}
              color="textMediumEmphasis"
              mb={2}
            >
              {!selectedDate.isSame(Date.now(), "date")
                ? selectedDate.format("dddd, D MMM YYYY")
                : `Today, ${selectedDate.format("D MMM YYYY")}`}
            </Typography.Body>
          )}
        </Box>
        {dateSelector}
      </Flex>
      <Box mx={[0, 3]}>
        {emptyObservationPlaceholder}
        {observations
          ?.sort((a, b) => {
            const firstArea = a.area?.name ?? ""
            const secondArea = b.area?.name ?? ""
            return firstArea.localeCompare(secondArea)
          })
          .map((observation) => (
            <Link
              key={observation.id}
              to={STUDENT_OVERVIEWS_OBSERVATION_DETAILS_URL(
                studentId,
                observation.id
              )}
            >
              <ObservationCard key={observation.id} observation={observation} />
            </Link>
          ))}
        {isLoading && !data && <ObservationLoadingPlaceholder />}
      </Box>
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
