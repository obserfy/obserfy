/** @jsx jsx */
import { FC, Fragment, useEffect, useRef, useState } from "react"
import { Box, Button, Card, Flex, Image, jsx, Label } from "theme-ui"
import useGetObservation from "../../api/observations/useGetObservation"
import Dialog from "../Dialog/Dialog"
import DialogHeader from "../DialogHeader/DialogHeader"
import Input from "../Input/Input"
import usePatchObservation from "../../api/observations/usePatchObservation"
import LoadingPlaceholder from "../LoadingPlaceholder/LoadingPlaceholder"
import DataBox from "../DataBox/DataBox"
import Icon from "../Icon/Icon"
import { ReactComponent as TrashIcon } from "../../icons/trash.svg"
import { ReactComponent as PlusIcon } from "../../icons/plus.svg"
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
import usePostNewObservationImage from "../../api/observations/usePostNewObservationImage"
import LoadingIndicator from "../LoadingIndicator/LoadingIndicator"
import useDeleteObservationImage from "../../api/observations/useDeleteObservationImage"

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
      <Box mx={3}>
        <LoadingPlaceholder sx={{ height: 210 }} mb={2} />
        <LoadingPlaceholder sx={{ height: 150 }} mb={2} />
        <LoadingPlaceholder sx={{ height: 92 }} mb={2} />
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
            return result?.ok
          }}
        />
        <DateDataBox
          label="Event Time"
          originalValue={dayjs(data?.eventTime)}
          onSave={async (eventTime) => {
            const result = await patchObservation({ eventTime })
            return result?.ok
          }}
        />
        <SingleChoiceDataBox
          label="Area"
          originalValue={data?.area?.id}
          onSave={async (areaId) => {
            const result = await patchObservation({ areaId })
            return result?.ok
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
            return result?.ok
          }}
        />
      </Card>

      <Card sx={{ borderRadius: [0, "default"] }} mx={[0, 3]} pt={3}>
        <Typography.Body
          mb={2}
          color="textMediumEmphasis"
          sx={{ lineHeight: 1, fontSize: [1, 0] }}
          px={3}
        >
          Images
        </Typography.Body>
        <ImagesDataBox
          observationId={observationId}
          images={data?.images ?? []}
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

const ImagesDataBox: FC<{
  images: Array<{ id: string; thumbnailUrl: string; originalUrl: string }>
  observationId: string
}> = ({ images, observationId }) => {
  const [selectedIdx, setSelectedIdx] = useState<number>()
  const [postNewImage, { isLoading }] = usePostNewObservationImage(
    observationId
  )
  const selectedImage =
    selectedIdx !== undefined ? images[selectedIdx] : undefined
  const [deleteImage, deleteImageState] = useDeleteObservationImage(
    observationId,
    selectedImage?.id
  )

  const fileSelector = useRef<HTMLInputElement>(null)

  return (
    <Fragment>
      <Flex px={3} mb={2} sx={{ flexWrap: "wrap", alignItems: "center" }}>
        {images.map((image, idx) => {
          const isSelected = selectedIdx === idx
          return (
            <Image
              key={image.id}
              src={image.thumbnailUrl}
              mr={2}
              mb={2}
              sx={{
                height: "40px",
                width: "40px",
                borderRadius: "default",
                cursor: "pointer",
                boxShadow: isSelected ? "0 0 0 2px #00a875" : "",
                ...borderFull,
              }}
              onClick={() => setSelectedIdx(isSelected ? undefined : idx)}
            />
          )
        })}
        <Label
          mb={2}
          sx={{
            height: "40px",
            width: "40px",
            backgroundColor: "background",
            borderRadius: "default",
            cursor: "pointer",
            "&:hover": { borderColor: "primary" },
            opacity: isLoading ? 0.5 : 1,
            ...borderFull,
          }}
          variant="outline"
          p={0}
        >
          <input
            ref={fileSelector}
            type="file"
            sx={{ display: "none" }}
            accept="image/*"
            disabled={isLoading}
            onChange={async (e) => {
              if (e.target.files) {
                await postNewImage(e.target.files[0])
              }
            }}
          />
          {isLoading ? (
            <LoadingIndicator m="auto" />
          ) : (
            <Icon as={PlusIcon} m="auto" />
          )}
        </Label>
      </Flex>
      {selectedIdx !== undefined && (
        <Fragment>
          <Image src={selectedImage?.originalUrl} sx={{ width: "100%" }} />
          <Button
            variant="outline"
            color="danger"
            ml="auto"
            mr={3}
            my={3}
            onClick={async () => {
              await deleteImage()
              setSelectedIdx(undefined)
            }}
          >
            {deleteImageState.isLoading ? (
              <LoadingIndicator m="auto" />
            ) : (
              <Fragment>Delete Image</Fragment>
            )}
          </Button>
        </Fragment>
      )}
    </Fragment>
  )
}

const ShortTextDataBox: FC<{
  label: string
  originalValue?: string
  onSave: (value: string) => Promise<boolean | undefined>
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
  onSave: (value: string) => Promise<boolean | undefined>
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
  onSave: (value: string) => Promise<boolean | undefined>
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
            {possibleValues.map(({ text, id }) => {
              const isSelected = id === value
              return (
                <Chip
                  key={id}
                  text={text}
                  activeBackground="primary"
                  isActive={isSelected}
                  onClick={() => setValue(isSelected ? "" : id)}
                  mr={2}
                  mb={2}
                />
              )
            })}
          </Flex>
        </Dialog>
      )}
    </Fragment>
  )
}

const DateDataBox: FC<{
  label: string
  originalValue?: Dayjs
  onSave: (value: Dayjs) => Promise<boolean | undefined>
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
