import React, { FC, Fragment, useEffect, useRef, useState } from "react"
import { Box, Button, Card, Flex } from "theme-ui"
import useGetObservation from "../../api/observations/useGetObservation"
import Dialog from "../Dialog/Dialog"
import DialogHeader from "../DialogHeader/DialogHeader"
import Input from "../Input/Input"
import usePatchObservation from "../../api/observations/usePatchObservation"
import LoadingPlaceholder from "../LoadingPlaceholder/LoadingPlaceholder"
import DataBox from "../DataBox/DataBox"
import Icon from "../Icon/Icon"
import { ReactComponent as TrashIcon } from "../../icons/trash.svg"
import DeleteObservationDialog from "../DeleteObservationDialog/DeleteObservationDialog"
import { navigate } from "../Link/Link"
import TextArea from "../TextArea/TextArea"
import MultilineDataBox from "../MultilineDataBox/MultilineDataBox"
import { useGetCurriculumAreas } from "../../api/useGetCurriculumAreas"
import Chip from "../Chip/Chip"

export interface PageObservationDetailsProps {
  observationId: string
  backUrl: string
}
export const PageObservationDetails: FC<PageObservationDetailsProps> = ({
  observationId,
  backUrl,
}) => {
  const { data, isLoading } = useGetObservation(observationId)
  const areas = useGetCurriculumAreas()
  const [isDeleting, setIsDeleting] = useState(false)
  const [patchObservation, patchObservationState] = usePatchObservation(
    observationId
  )

  if (isLoading) {
    return (
      <Box>
        <LoadingPlaceholder />
      </Box>
    )
  }

  return (
    <Box>
      <Card sx={{ borderRadius: [0, "default"] }} mx={[0, 3]} mb={3}>
        <ShortTextDataBox
          label="Short Description"
          originalValue={data?.shortDesc}
          isLoading={patchObservationState.isLoading}
          onSave={async (shortDesc) => {
            const result = await patchObservation({ shortDesc })
            return result.ok
          }}
        />
        <SingleChoiceDataBox
          label="Area"
          originalValue={data?.area?.id}
          onSave={async (areaId) => {
            const result = await patchObservation({ areaId })
            return result.ok
          }}
          possibleValues={
            areas.data?.map(({ id, name }) => ({
              id,
              text: name,
            })) ?? []
          }
        />
      </Card>

      <Card sx={{ borderRadius: [0, "default"] }} mx={[0, 3]}>
        <LongTextDataBox
          label="Details"
          originalValue={data?.longDesc}
          isLoading={patchObservationState.isLoading}
          onSave={async (longDesc) => {
            const result = await patchObservation({ longDesc })
            return result.ok
          }}
        />
      </Card>

      <Button
        variant="outline"
        color="danger"
        ml="auto"
        mr={3}
        my={3}
        onClick={() => setIsDeleting(true)}
      >
        <Icon as={TrashIcon} fill="danger" mr={2} />
        Delete
      </Button>
      {isDeleting && (
        <DeleteObservationDialog
          shortDesc={data?.shortDesc ?? ""}
          observationId={observationId}
          onDeleted={() => navigate(backUrl)}
          onDismiss={() => setIsDeleting(false)}
        />
      )}
    </Box>
  )
}

const ShortTextDataBox: FC<{
  label: string
  originalValue?: string
  onSave: (value: string) => Promise<boolean>
  isLoading?: boolean
}> = ({ label, originalValue, isLoading, onSave }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [value, setValue] = useState(originalValue ?? "")

  const inputField = useRef<HTMLInputElement>(null)
  useEffect(() => {
    if (isEditing) {
      inputField.current?.focus()
    }
  }, [isEditing])

  return (
    <Fragment>
      <DataBox
        label={label}
        value={originalValue ?? ""}
        onEditClick={() => setIsEditing(true)}
      />
      {isEditing && (
        <Dialog>
          <DialogHeader
            title={`Edit ${label}`}
            onAcceptText="Save"
            onCancel={() => setIsEditing(false)}
            loading={isLoading}
            onAccept={async () => {
              const ok = await onSave(value)
              if (ok) {
                setIsEditing(false)
              }
            }}
          />
          <Input
            label={label}
            sx={{ width: "100%" }}
            onChange={(e) => setValue(e.target.value)}
            value={value}
            ref={inputField}
            containerSx={{ p: 3, backgroundColor: "background" }}
          />
        </Dialog>
      )}
    </Fragment>
  )
}

const LongTextDataBox: FC<{
  label: string
  originalValue?: string
  onSave: (value: string) => Promise<boolean>
  isLoading?: boolean
}> = ({ label, originalValue, isLoading, onSave }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [value, setValue] = useState(originalValue ?? "")

  const inputField = useRef<HTMLTextAreaElement>(null)
  useEffect(() => {
    if (isEditing) {
      inputField.current?.focus()
    }
  }, [isEditing])

  return (
    <Fragment>
      <MultilineDataBox
        label={label}
        value={originalValue ?? ""}
        onEditClick={() => setIsEditing(true)}
        placeholder="-"
      />
      {isEditing && (
        <Dialog>
          <DialogHeader
            title={`Edit ${label}`}
            onAcceptText="Save"
            onCancel={() => setIsEditing(false)}
            loading={isLoading}
            onAccept={async () => {
              const ok = await onSave(value)
              if (ok) {
                setIsEditing(false)
              }
            }}
          />
          <TextArea
            label={label}
            sx={{ width: "100%", lineHeight: 1.8, minHeight: 400 }}
            onChange={(e) => setValue(e.target.value)}
            value={value}
            ref={inputField}
            containerSx={{ p: 3, backgroundColor: "background" }}
            placeholder="Write something"
          />
        </Dialog>
      )}
    </Fragment>
  )
}

const SingleChoiceDataBox: FC<{
  label: string
  originalValue?: string
  possibleValues: Array<{ id: string; text: string }>
  onSave: (value: string) => Promise<boolean>
  isLoading?: boolean
}> = ({ possibleValues, label, originalValue, isLoading, onSave }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [value, setValue] = useState(originalValue ?? "")

  const original = possibleValues.find((v) => v.id === originalValue)

  return (
    <Fragment>
      <DataBox
        label={label}
        value={original?.text ?? ""}
        onEditClick={() => setIsEditing(true)}
      />
      {isEditing && (
        <Dialog>
          <DialogHeader
            title={`Edit ${label}`}
            onAcceptText="Save"
            onCancel={() => setIsEditing(false)}
            loading={isLoading}
            onAccept={async () => {
              const ok = await onSave(value)
              if (ok) {
                setIsEditing(false)
              }
            }}
          />
          <Flex
            px={3}
            pt={3}
            pb={2}
            sx={{ flexWrap: "wrap", backgroundColor: "background" }}
          >
            {possibleValues.map(({ text, id }) => (
              <Chip
                key={id}
                text={text}
                activeBackground="primary"
                isActive={id === value}
                onClick={() => setValue(id)}
                mr={2}
                mb={2}
              />
            ))}
          </Flex>
        </Dialog>
      )}
    </Fragment>
  )
}

export default PageObservationDetails
