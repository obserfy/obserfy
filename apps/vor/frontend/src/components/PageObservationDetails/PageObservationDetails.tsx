import React, { FC, Fragment, useEffect, useRef, useState } from "react"
import { Box, Button, Card, Flex, Image } from "theme-ui"
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
import DatePickerDialog from "../DatePickerDialog/DatePickerDialog"
import dayjs, { Dayjs } from "../../dayjs"
import Typography from "../Typography/Typography"
import { borderFull } from "../../border"

export interface PageObservationDetailsProps {
  observationId: string
  studentId: string
  backUrl: string
}
export const PageObservationDetails: FC<PageObservationDetailsProps> = ({
  observationId,
  studentId,
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
        <DateDataBox
          label="Event Time"
          originalValue={dayjs(data?.eventTime)}
          onSave={async (eventTime) => {
            const result = await patchObservation({ eventTime })
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

      <Card sx={{ borderRadius: [0, "default"] }} mx={[0, 3]} mb={3}>
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

      {(data?.images ?? []).length > 0 && (
        <Card sx={{ borderRadius: [0, "default"] }} mx={[0, 3]} pt={3}>
          <Typography.Body
            mb={2}
            color="textMediumEmphasis"
            sx={{ lineHeight: 1, fontSize: [1, 0] }}
            px={3}
          >
            Images
          </Typography.Body>
          <Images images={data?.images ?? []} />
        </Card>
      )}

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
          studentId={studentId}
          shortDesc={data?.shortDesc ?? ""}
          observationId={observationId}
          onDeleted={() => navigate(backUrl)}
          onDismiss={() => setIsDeleting(false)}
        />
      )}
    </Box>
  )
}

const Images: FC<{
  images: Array<{ id: string; thumbnailUrl: string; originalUrl: string }>
}> = ({ images }) => {
  const [selectedIdx, setSelectedIdx] = useState<number>()

  return (
    <>
      <Flex px={3} mb={3}>
        {images.map((image, idx) => {
          const isSelected = selectedIdx === idx
          return (
            <Image
              key={image.id}
              src={image.thumbnailUrl}
              height={40}
              width={40}
              mr={2}
              sx={{
                borderRadius: "default",
                cursor: "pointer",
                boxShadow: isSelected ? "0 0 0 2px #00a875" : "",
                ...borderFull,
              }}
              onClick={() => setSelectedIdx(isSelected ? undefined : idx)}
            />
          )
        })}
      </Flex>
      {selectedIdx !== undefined && (
        <Image src={images[selectedIdx].originalUrl} sx={{ width: "100%" }} />
      )}
    </>
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
        value={original?.text ?? "-"}
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

const DateDataBox: FC<{
  label: string
  originalValue?: Dayjs
  onSave: (value: Dayjs) => Promise<boolean>
  isLoading?: boolean
}> = ({ label, originalValue, isLoading, onSave }) => {
  const [isEditing, setIsEditing] = useState(false)

  return (
    <Fragment>
      <DataBox
        label={label}
        value={originalValue?.format("dddd, DD MMM YYYY") ?? ""}
        onEditClick={() => setIsEditing(true)}
      />
      {isEditing && (
        <DatePickerDialog
          isLoading={isLoading}
          defaultDate={originalValue}
          onDismiss={() => setIsEditing(false)}
          onConfirm={async (date) => {
            const ok = await onSave(date)
            if (ok) {
              setIsEditing(false)
            }
          }}
        />
      )}
    </Fragment>
  )
}

export default PageObservationDetails
