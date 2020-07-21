import React, { FC, useState } from "react"
import { Flex, Button } from "theme-ui"
import Typography from "../Typography/Typography"
import Spacer from "../Spacer/Spacer"

import LoadingIndicator from "../LoadingIndicator/LoadingIndicator"
import Dialog from "../Dialog/Dialog"

interface Props {
  shortDesc: string
  observationId: string
  onDeleted: () => void
  onDismiss: () => void
}
export const DeleteObservationDialog: FC<Props> = ({
  onDismiss,
  observationId,
  shortDesc,
  onDeleted,
}) => {
  const [loading, setLoading] = useState(false)

  async function deleteObservation(): Promise<void> {
    setLoading(true)
    const baseUrl = "/api/v1"
    const response = await fetch(`${baseUrl}/observations/${observationId}`, {
      credentials: "same-origin",
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    })
    analytics.track("Observation Deleted", {
      responseStatus: response.status,
      observationId,
    })
    setLoading(false)
    onDeleted()
  }

  return (
    <Dialog sx={{ maxWidth: ["", "maxWidth.xsm"] }}>
      <Flex
        backgroundColor="surface"
        p={3}
        sx={{
          justifyContent: "center",
          flexShrink: 0,
          position: "relative",
          borderBottomColor: "border",
          borderBottomWidth: 1,
          borderBottomStyle: "solid",
        }}
      >
        <Typography.H6
          sx={{
            pointerEvents: "none",
            alignContent: "center",
          }}
        >
          Delete Observation?
        </Typography.H6>
      </Flex>
      <Typography.Body
        p={3}
        sx={{
          borderBottomColor: "border",
          borderBottomWidth: 1,
          borderBottomStyle: "solid",
        }}
      >
        <i>&quot;{shortDesc}&quot;</i> will be permanently deleted. Are you
        sure?
      </Typography.Body>
      <Flex sx={{ alignItems: "center" }}>
        <Spacer />
        <Button variant="outline" m={2} onClick={onDismiss}>
          Cancel
        </Button>
        <Button
          m={2}
          backgroundColor="danger"
          onClick={deleteObservation}
          data-cy="confirm-delete"
        >
          {loading && <LoadingIndicator />}
          Yes
        </Button>
      </Flex>
    </Dialog>
  )
}

export default DeleteObservationDialog
