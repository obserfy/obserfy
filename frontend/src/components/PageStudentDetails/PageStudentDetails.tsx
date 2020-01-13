import React, { FC, useState } from "react"
import { navigate } from "gatsby"
import isThisWeek from "date-fns/isThisWeek"
import isToday from "date-fns/isToday"
import { useQueryStudentDetails } from "../../hooks/students/useQueryStudentDetails"
import Flex from "../Flex/Flex"
import Box from "../Box/Box"
import Typography from "../Typography/Typography"
import Icon from "../Icon/Icon"
import EmptyListPlaceholder from "../EmptyListPlaceholder/EmptyListPlaceholder"
import AddObservationDialog from "../AddObservationDialog/AddObservationDialog"
import Button from "../Button/Button"
import { ReactComponent as EditIcon } from "../../icons/edit.svg"
import { BackNavigation } from "../BackNavigation/BackNavigation"
import LoadingPlaceholder from "../LoadingPlaceholder/LoadingPlaceholder"
import {
  Observation,
  useQueryStudentObservations,
} from "../../hooks/students/useQueryStudentObservations"
import EditObservationDialog from "../EditObservationDialog/EditObservationDialog"
import DeleteObservationDialog from "../DeleteObservationDialog/DeleteObservationDialog"
import { getAnalytics } from "../../analytics"
import ObservationCard from "../ObservationCard/ObservationCard"
import Spacer from "../Spacer/Spacer"
import ToggleButton from "../ToggleButton/ToggleButton"
import StudentProgressSummaryCard from "../StudentProgressSummaryCard/StudentProgressSummaryCard"

enum ObservationFilterType {
  TODAY,
  THIS_WEEK,
  ALL,
}
function filterObservation(
  filterType: ObservationFilterType,
  observation: Observation
): boolean {
  const creationDate = observation.createdDate ?? ""
  switch (filterType) {
    case ObservationFilterType.ALL:
      return true
    case ObservationFilterType.THIS_WEEK:
      return isThisWeek(Date.parse(creationDate))
    case ObservationFilterType.TODAY:
      return isToday(Date.parse(creationDate))
    default:
      return false
  }
}
interface Props {
  id: string
}
export const PageStudentDetails: FC<Props> = ({ id }) => {
  const [observationFilterType, setObservationFilterType] = useState(
    ObservationFilterType.TODAY
  )
  const [isAddingObservation, setIsAddingObservation] = useState(false)
  const [isEditingObservation, setIsEditingObservation] = useState(false)
  const [isDeletingObservation, setIsDeletingObservation] = useState(false)
  const [targetObservation, setTargetObservation] = useState()
  const [details] = useQueryStudentDetails(id)
  const [
    observations,
    setObservationsAsOutdated,
    isObservationLoading,
  ] = useQueryStudentObservations(id)

  const filteredObservation =
    observationFilterType === ObservationFilterType.ALL
      ? observations
      : observations?.filter(observation =>
          filterObservation(observationFilterType, observation)
        )

  function addObservation(): void {
    setTargetObservation(undefined)
    setIsAddingObservation(true)
  }
  async function submitAddObservation(observation: Observation): Promise<void> {
    const baseUrl = "/api/v1"
    const response = await fetch(`${baseUrl}/students/${id}/observations`, {
      credentials: "same-origin",
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(observation),
    })
    setIsAddingObservation(false)
    setObservationsAsOutdated()

    getAnalytics()?.track("Observation Created", {
      responseStatus: response.status,
      observationId: observation.id,
    })
  }
  async function submitEditObservation(
    observation: Observation
  ): Promise<void> {
    const baseUrl = "/api/v1"
    const response = await fetch(`${baseUrl}/observations/${observation.id}`, {
      credentials: "same-origin",
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(observation),
    })
    setIsAddingObservation(false)
    setObservationsAsOutdated()
    getAnalytics()?.track("Observation Updated", {
      responseStatus: response.status,
      observationId: observation.id,
    })
  }
  async function submitDeleteObservation(
    observation: Observation
  ): Promise<void> {
    const baseUrl = "/api/v1"
    const response = await fetch(`${baseUrl}/observations/${observation.id}`, {
      credentials: "same-origin",
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    })
    setObservationsAsOutdated()
    setIsDeletingObservation(false)
    getAnalytics()?.track("Observation Deleted", {
      responseStatus: response.status,
      observationId: observation.id,
    })
  }

  const listOfObservations = filteredObservation
    ?.sort(
      (a, b) =>
        Date.parse(b.createdDate ?? "") - Date.parse(a.createdDate ?? "")
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

  const emptyObservationPlaceholder = (filteredObservation ?? []).length ===
    0 && (
    <EmptyListPlaceholder
      text="No observation have been added"
      callToActionText="new observation"
      onActionClick={addObservation}
    />
  )

  const addObservationDialog = isAddingObservation && (
    <AddObservationDialog
      onCancel={() => setIsAddingObservation(false)}
      onConfirm={observation => {
        submitAddObservation(observation)
        setIsAddingObservation(false)
      }}
    />
  )

  const editObservationDialog = isEditingObservation && (
    <EditObservationDialog
      defaultValue={targetObservation}
      onCancel={() => setIsEditingObservation(false)}
      onConfirm={observation => {
        submitEditObservation(observation)
        setIsEditingObservation(false)
      }}
    />
  )

  const deleteObservationDialog = isDeletingObservation && (
    <DeleteObservationDialog
      observation={targetObservation}
      onConfirm={target => submitDeleteObservation(target)}
      onCancel={() => setIsDeletingObservation(false)}
    />
  )

  return (
    <>
      <Box maxWidth="maxWidth.sm" margin="auto" pb={5}>
        <Flex>
          <BackNavigation text="Home" to="/dashboard/home" />
        </Flex>
        <Flex alignItems="start" mx={3} mb={4} mt={3}>
          <Typography.H3 sx={{ wordWrap: "break-word" }}>
            {details?.name || <LoadingPlaceholder width="24rem" height={60} />}
          </Typography.H3>
          <Spacer />
          <Button
            mt={11}
            ml={3}
            minWidth={43}
            variant="outline"
            onClick={() => navigate(`/dashboard/students/edit?id=${id}`)}
          >
            <Icon minWidth={20} as={EditIcon} m={0} />
          </Button>
        </Flex>
        <Box p={3}>
          <SectionHeader>PROGRESS</SectionHeader>
          <StudentProgressSummaryCard studentId={id} />
        </Box>
        <Box p={3}>
          <Flex alignItems="center" mb={3}>
            <SectionHeader>OBSERVATIONS</SectionHeader>
            <Spacer />
            <Button variant="outline" onClick={addObservation}>
              New
            </Button>
          </Flex>
          <ToggleButton
            itemFlexProp={[1]}
            mb={3}
            values={["Today", "This Week", "All"]}
            selectedItemIdx={observationFilterType}
            onItemClick={setObservationFilterType}
          />
          {!isObservationLoading && emptyObservationPlaceholder}
          {isObservationLoading && <ObservationLoadingPlaceholder />}
          {listOfObservations}
        </Box>
      </Box>
      {addObservationDialog}
      {editObservationDialog}
      {deleteObservationDialog}
    </>
  )
}

const SectionHeader: FC = props => (
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
