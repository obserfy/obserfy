import React, { FC, Fragment, useEffect, useRef, useState } from "react"
import { Box, Button, Card, Flex } from "theme-ui"
import useGetObservation from "../../api/observations/useGetObservation"
import Typography from "../Typography/Typography"
import Icon from "../Icon/Icon"
import { ReactComponent as EditIcon } from "../../icons/edit.svg"
import Dialog from "../Dialog/Dialog"
import DialogHeader from "../DialogHeader/DialogHeader"
import Input from "../Input/Input"
import usePatchObservation from "../../api/observations/usePatchObservation"
import LoadingPlaceholder from "../LoadingPlaceholder/LoadingPlaceholder"

export interface PageObservationDetailsProps {
  observationId: string
}
export const PageObservationDetails: FC<PageObservationDetailsProps> = ({
  observationId,
}) => {
  const { data, isLoading } = useGetObservation(observationId)

  if (isLoading) {
    return (
      <Box>
        <LoadingPlaceholder />
      </Box>
    )
  }

  return (
    <Box>
      <Card sx={{ borderRadius: [0, "default"] }}>
        <ShortDescriptionDataBox
          originalValue={data?.shortDesc}
          observationId={observationId}
        />
      </Card>
    </Box>
  )
}

const ShortDescriptionDataBox: FC<{
  originalValue?: string
  observationId: string
}> = ({ originalValue, observationId }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [mutate, { status }] = usePatchObservation(observationId)
  const [shortDesc, setShortDesc] = useState(originalValue)

  const inputField = useRef<HTMLInputElement>(null)
  useEffect(() => {
    if (isEditing) {
      inputField.current?.focus()
    }
  }, [isEditing])

  return (
    <Fragment>
      <DataBox
        label="Short Description"
        value={originalValue ?? ""}
        onEditClick={() => {
          setIsEditing(true)
        }}
      />
      {isEditing && (
        <Dialog>
          <DialogHeader
            title="Edit Short Desc"
            onAcceptText="Save"
            onCancel={() => setIsEditing(false)}
            loading={status === "loading"}
            onAccept={async () => {
              await mutate({ shortDesc })
              setIsEditing(false)
            }}
          />
          <Box sx={{ backgroundColor: "background" }} p={3}>
            <Input
              autoFocus
              label="Name"
              sx={{ width: "100%" }}
              onChange={(e) => setShortDesc(e.target.value)}
              value={shortDesc}
              ref={inputField}
            />
          </Box>
        </Dialog>
      )}
    </Fragment>
  )
}

const DataBox: FC<{
  label: string
  value: string
  onEditClick?: () => void
}> = ({ label, value, onEditClick }) => (
  <Flex px={3} py={3} sx={{ alignItems: "flex-start" }}>
    <Box>
      <Typography.Body
        mb={1}
        color="textMediumEmphasis"
        sx={{ lineHeight: 1, fontSize: 0 }}
      >
        {label}
      </Typography.Body>
      <Typography.Body>{value}</Typography.Body>
    </Box>
    <Button
      variant="outline"
      ml="auto"
      px={2}
      onClick={onEditClick}
      sx={{ flexShrink: 0 }}
      aria-label={`edit-${label.toLowerCase()}`}
    >
      <Icon as={EditIcon} />
    </Button>
  </Flex>
)

export default PageObservationDetails
