import React, { FC, useState } from "react"
import Box from "../Box/Box"
import { ReactComponent as PlusIcon } from "../../icons/plus.svg"
import { ReactComponent as NextIcon } from "../../icons/next-arrow.svg"
import Flex from "../Flex/Flex"
import MockAvatar from "../mockAvatar"
import Typography from "../Typography/Typography"
import FloatingActionButton from "../FloatingActionButton/FloatingActionButton"
import Icon from "../Icon/Icon"
import Card from "../Card/Card"
import Spacer from "../Spacer/Spacer"
import { useQueryStudentDetails } from "../../hooks/students/useQueryStudentDetails"
import Button from "../Button/Button"
import EmptyListPlaceholder from "../EmptyListPlaceholder/EmptyListPlaceholder"
import AddObservationDialog from "../AddObservationDialog/AddObservationDialog"

export interface Observation {
  shortDesc: string
  longDesc: string
}
interface Props {
  id: string
}
export const PageEditStudent: FC<Props> = ({ id }) => {
  const [showAddObservationDialog, setShowObservationDialog] = useState(false)
  const [observations, setObservations] = useState<Observation[]>([])
  const [editObservations, setEditObservations] = useState()
  const [details] = useQueryStudentDetails(id)

  function addObservation(): void {
    setEditObservations(undefined)
    setShowObservationDialog(true)
  }

  const listOfObservations = observations.map(({ longDesc, shortDesc }) => (
    <Card
      p={3}
      mb={3}
      onClick={() => {
        setEditObservations({ longDesc, shortDesc })
        setShowObservationDialog(true)
      }}
    >
      <Flex alignItems="center">
        <Box>
          <Typography.Body fontSize={1} color="textMediumEmphasis">
            Thursday, 26 Dec &amp;19
          </Typography.Body>
          <Typography.H5>{shortDesc}</Typography.H5>
        </Box>
        <Spacer />
        <Icon as={NextIcon} m={0} />
      </Flex>
    </Card>
  ))

  const emptyObservationPlaceholder = observations.length === 0 && (
    <EmptyListPlaceholder
      text="What did you observe?"
      callToActionText="add observation"
      onActionClick={addObservation}
    />
  )

  const addObservationDialog = showAddObservationDialog && (
    <AddObservationDialog
      defaultValue={editObservations}
      onCancel={() => setShowObservationDialog(false)}
      onConfirm={name => {
        setObservations([...observations, name])
        setShowObservationDialog(false)
      }}
    />
  )

  return (
    <>
      <Box>
        <Flex alignItems="center" p={3}>
          <MockAvatar size={60} />
          <Typography.H3>{details?.name}</Typography.H3>
        </Flex>
        <Button ml={3} variant="outline">
          Edit student
        </Button>
        <Box p={3}>
          <Typography.H4 color="textMediumEmphasis" mb={2}>
            Observations
          </Typography.H4>
          {emptyObservationPlaceholder}
          {listOfObservations}
        </Box>
      </Box>
      <FloatingActionButton onClick={addObservation}>
        <Icon as={PlusIcon} m={0} fill="onPrimary" />
      </FloatingActionButton>
      {addObservationDialog}
    </>
  )
}

export default PageEditStudent
