import React, { FC, useState } from "react"
import { navigate } from "gatsby"
import { Link } from "gatsby-plugin-intl3"
import { useGetStudent } from "../../api/useGetStudent"
import Flex from "../Flex/Flex"
import Box from "../Box/Box"
import Typography from "../Typography/Typography"
import Icon from "../Icon/Icon"
import EmptyListPlaceholder from "../EmptyListPlaceholder/EmptyListPlaceholder"
import Button from "../Button/Button"
import { ReactComponent as EditIcon } from "../../icons/edit.svg"
import { BackNavigation } from "../BackNavigation/BackNavigation"
import LoadingPlaceholder from "../LoadingPlaceholder/LoadingPlaceholder"
import { Observation, useGetObservations } from "../../api/useGetObservations"
import EditObservationDialog from "../EditObservationDialog/EditObservationDialog"
import DeleteObservationDialog from "../DeleteObservationDialog/DeleteObservationDialog"
import { getAnalytics } from "../../analytics"
import ObservationCard from "../ObservationCard/ObservationCard"
import Spacer from "../Spacer/Spacer"
import StudentProgressSummaryCard from "../StudentProgressSummaryCard/StudentProgressSummaryCard"

interface Props {
  id: string
}
export const PageStudentDetails: FC<Props> = ({ id }) => {
  const [isEditingObservation, setIsEditingObservation] = useState(false)
  const [isDeletingObservation, setIsDeletingObservation] = useState(false)
  const [targetObservation, setTargetObservation] = useState()
  const [details] = useGetStudent(id)
  const [
    observations,
    isObservationLoading,
    setObservationsAsOutdated,
  ] = useGetObservations(id)

  const filteredObservation = observations

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
    setIsEditingObservation(false)
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
      onActionClick={() =>
        navigate(`/dashboard/students/observations/new?studentId=${id}`)
      }
    />
  )

  return (
    <>
      <Box maxWidth="maxWidth.sm" margin="auto" pb={5}>
        <BackNavigation text="Home" to="/dashboard/home" />
        <Flex alignItems="start" mx={3} mb={4} mt={3}>
          <Typography.H3 sx={{ wordWrap: "break-word" }}>
            {details?.name || <LoadingPlaceholder width="24rem" height={60} />}
          </Typography.H3>
          <Spacer />
          <Button
            data-cy="edit"
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
            <Link to={`/dashboard/students/observations/new?studentId=${id}`}>
              <Button variant="outline">New</Button>
            </Link>
          </Flex>
          {!isObservationLoading && emptyObservationPlaceholder}
          {isObservationLoading && <ObservationLoadingPlaceholder />}
          {listOfObservations}
        </Box>
      </Box>
      {isEditingObservation && (
        <EditObservationDialog
          defaultValue={targetObservation}
          onCancel={() => setIsEditingObservation(false)}
          onConfirm={submitEditObservation}
        />
      )}
      {isDeletingObservation && (
        <DeleteObservationDialog
          observation={targetObservation}
          onConfirm={submitDeleteObservation}
          onCancel={() => setIsDeletingObservation(false)}
        />
      )}
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
