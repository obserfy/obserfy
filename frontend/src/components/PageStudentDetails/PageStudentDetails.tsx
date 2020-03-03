import React, { FC, useState } from "react"
import { navigate } from "gatsby"
import { FormattedDate, Link } from "gatsby-plugin-intl3"
import isSameDay from "date-fns/isSameDay"
import startOfDay from "date-fns/startOfDay"
import differenceInDays from "date-fns/differenceInDays"
import { useGetStudent } from "../../api/useGetStudent"
import Flex from "../Flex/Flex"
import Box from "../Box/Box"
import Typography, { TextProps } from "../Typography/Typography"
import Icon from "../Icon/Icon"
import EmptyListPlaceholder from "../EmptyListPlaceholder/EmptyListPlaceholder"
import Button from "../Button/Button"
import { ReactComponent as EditIcon } from "../../icons/edit.svg"
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
        startOfDay(Date.parse(createdDate ?? "")).toISOString()
      )
    ),
  ]?.sort((a, b) => differenceInDays(Date.parse(b), Date.parse(a)))

  const listOfObservations = observations.data
    ?.filter(observation =>
      isSameDay(
        Date.parse(observation.createdDate ?? ""),
        Date.parse(dates[selectedDate])
      )
    )
    ?.map(observation => (
      <ObservationCard
        key={observation.id}
        observation={observation}
        onDelete={value => {
          setTargetObservation(value)
          setIsDeletingObservation(true)
        }}
        onEdit={value => {
          setTargetObservation(value)
          setIsEditingObservation(true)
        }}
      />
    ))

  const emptyObservationPlaceholder = !observations.isFetching &&
    (observations.data ?? []).length === 0 && (
      <EmptyListPlaceholder
        text="No observation have been added"
        callToActionText="new observation"
        onActionClick={() =>
          navigate(
            `/dashboard/observe/students/observations/new?studentId=${id}`
          )
        }
      />
    )

  return (
    <>
      <Box maxWidth="maxWidth.sm" margin="auto" pb={5}>
        <BackNavigation text="Home" to="/dashboard/observe" />
        <Flex alignItems="start" mx={3} mb={4} mt={0}>
          <Typography.H3 sx={{ wordWrap: "break-word" }}>
            {student.data?.name || (
              <LoadingPlaceholder width="24rem" height={60} />
            )}
          </Typography.H3>
          <Spacer />
          <Button
            data-cy="edit"
            mt={11}
            ml={3}
            minWidth={43}
            variant="outline"
            onClick={() =>
              navigate(`/dashboard/observe/students/edit?id=${id}`)
            }
          >
            <Icon minWidth={20} as={EditIcon} m={0} />
          </Button>
        </Flex>
        <Box m={3} mb={2}>
          <Link
            to={`/dashboard/observe/students/observations/new?studentId=${id}`}
          >
            <Button variant="outline" width="100%">
              <Icon as={PlusIcon} m={0} mr={2} />
              Add Observation
            </Button>
          </Link>
        </Box>
        <Box p={3} mb={1}>
          <Box my={3}>
            <SectionHeader>PROGRESS</SectionHeader>
          </Box>
          <StudentProgressSummaryCard studentId={id} />
        </Box>
        <Box p={3}>
          <Flex mb={3} alignItems="center">
            <SectionHeader>OBSERVATIONS</SectionHeader>
            <Spacer />
            <Link
              to={`/dashboard/observe/students/observations/new?studentId=${id}`}
            >
              <Button variant="outline">New</Button>
            </Link>
          </Flex>
          {emptyObservationPlaceholder}
          {observations.isFetching && !observations.data && (
            <ObservationLoadingPlaceholder />
          )}
          {observations.data && (
            <Flex mb={3} alignItems="center">
              <Button
                backgroundColor="surface"
                disabled={selectedDate >= dates.length - 1}
                onClick={() => setSelectedDate(selectedDate + 1)}
                variant="outline"
                py={1}
                px={2}
              >
                <Icon as={PrevIcon} m={0} />
              </Button>
              <Typography.Body
                flex={1}
                textAlign="center"
                fontSize={2}
                color="textMediumEmphasis"
              >
                <FormattedDate
                  value={dates?.[selectedDate]}
                  month="short"
                  year="numeric"
                  weekday="short"
                  day="2-digit"
                />
              </Typography.Body>
              <Button
                backgroundColor="surface"
                disabled={selectedDate < 1}
                onClick={() => setSelectedDate(selectedDate - 1)}
                variant="outline"
                py={1}
                px={2}
              >
                <Icon as={NextIcon} m={0} />
              </Button>
            </Flex>
          )}
          {listOfObservations}
        </Box>
      </Box>
      {isEditingObservation && (
        <EditObservationDialog
          defaultValue={targetObservation}
          onDismiss={() => setIsEditingObservation(false)}
          onSaved={() => {
            setIsEditingObservation(false)
            observations.refetch()
          }}
        />
      )}
      {isDeletingObservation && targetObservation && (
        <DeleteObservationDialog
          observationId={targetObservation.id ?? ""}
          shortDesc={targetObservation?.shortDesc}
          onDismiss={() => setIsDeletingObservation(false)}
          onDeleted={() => {
            observations.refetch()
            setIsDeletingObservation(false)
          }}
        />
      )}
    </>
  )
}

const SectionHeader: FC<TextProps> = props => (
  <Typography.H5
    fontWeight="normal"
    color="textMediumEmphasis"
    letterSpacing={3}
    {...props}
  />
)

const ObservationLoadingPlaceholder: FC = () => (
  <Box>
    <LoadingPlaceholder width="100%" height={116} mb={3} />
    <LoadingPlaceholder width="100%" height={116} mb={3} />
    <LoadingPlaceholder width="100%" height={116} mb={3} />
  </Box>
)

export default PageStudentDetails
