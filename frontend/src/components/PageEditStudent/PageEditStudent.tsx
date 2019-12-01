import React, { FC, useState } from "react"
import Box from "../Box/Box"
import { ReactComponent as PlusIcon } from "../../icons/plus.svg"
import { ReactComponent as NextIcon } from "../../icons/next-arrow.svg"
import Flex from "../Flex/Flex"
import MockAvatar from "../mockAvatar"
import Typography from "../Typography/Typography"
import FloatingActionButton from "../FloatingActionButton/FloatingActionButton"
import Icon from "../Icon/Icon"
import ScrollableDialog from "../ScrollableDialog/ScrollableDialog"
import Input from "../Input/Input"
import TextArea from "../TextArea/TextArea"
import Card from "../Card/Card"
import Spacer from "../Spacer/Spacer"

interface Props {
  name: string
}
export const PageEditStudent: FC<Props> = ({ name }) => {
  const [showAddObservationDialog, setShowObservationDialog] = useState(false)
  const [observations, setObservations] = useState<Observation[]>([])
  const [editObservations, setEditObservations] = useState()

  return (
    <>
      <Box>
        <Flex
          alignItems="center"
          px={3}
          py={2}
          sx={{
            borderBottomWidth: 1,
            borderBottomStyle: "solid",
            borderBottomColor: "border",
          }}
        >
          <Typography.Body color="textMediumEmphasis" pr={3}>
            Recent
          </Typography.Body>
          <MockAvatar size={24} mr={3} opacity={0.8} />
          <MockAvatar size={24} mr={3} opacity={0.8} />
          <MockAvatar size={24} mr={3} opacity={0.8} />
          <MockAvatar size={24} mr={3} opacity={0.8} />
          <MockAvatar size={24} mr={3} opacity={0.8} />
        </Flex>
        <Flex alignItems="center" p={3}>
          <MockAvatar size={60} />
          <Typography.H3>{name}</Typography.H3>
        </Flex>
        <Box p={3}>
          <Typography.H4 color="textMediumEmphasis" mb={2}>
            Observations
          </Typography.H4>
          {observations.map(({ details, shortDesc }) => (
            <Card
              p={3}
              mb={3}
              onClick={() => {
                setEditObservations({ details, shortDesc })
                setShowObservationDialog(true)
              }}
            >
              <Flex alignItems="center">
                <Box>
                  <Typography.Body fontSize={1} color="textMediumEmphasis">
                    Monday, 26 Dec '19
                  </Typography.Body>
                  <Typography.H5>{shortDesc}</Typography.H5>
                </Box>
                <Spacer />
                <Icon as={NextIcon} m={0} />
              </Flex>
            </Card>
          ))}
        </Box>
      </Box>
      <FloatingActionButton
        onClick={() => {
          setEditObservations(undefined)
          setShowObservationDialog(true)
        }}
      >
        <Icon as={PlusIcon} m={0} fill="onPrimary" />
      </FloatingActionButton>
      {showAddObservationDialog && (
        <AddObservationDialog
          defaultValue={editObservations}
          onCancel={() => setShowObservationDialog(false)}
          onConfirm={name => {
            setObservations([...observations, name])
            setShowObservationDialog(false)
          }}
        />
      )}
    </>
  )
}

interface Observation {
  shortDesc: string
  details: string
}
interface NewStudentDialogProps {
  defaultValue?: Observation
  onCancel: () => void
  onConfirm: (observations: Observation) => void
}
const AddObservationDialog: FC<NewStudentDialogProps> = ({
  defaultValue,
  onConfirm,
  onCancel,
}) => {
  const [shortDesc, setShortDesc] = useState(defaultValue?.shortDesc ?? "")
  const [details, setDetails] = useState(defaultValue?.details ?? "")
  return (
    <ScrollableDialog
      title={defaultValue ? "Edit Observation" : "New Observation"}
      positiveText={defaultValue ? "Save" : "Add"}
      negativeText="Cancel"
      onPositiveClick={() => onConfirm({ details, shortDesc })}
      onDismiss={onCancel}
      onNegativeClick={onCancel}
      disablePositiveButton={shortDesc === ""}
    >
      <Box p={3}>
        <Input
          label="Short Description"
          width="100%"
          placeholder="What have you find?"
          onChange={e => setShortDesc(e.target.value)}
          value={shortDesc}
          mb={3}
        />
        <TextArea
          label="Details"
          width="100%"
          fontSize={2}
          placeholder="Tell us about what you observed"
          onChange={e => setDetails(e.target.value)}
          value={details}
        />
      </Box>
    </ScrollableDialog>
  )
}

export default PageEditStudent
