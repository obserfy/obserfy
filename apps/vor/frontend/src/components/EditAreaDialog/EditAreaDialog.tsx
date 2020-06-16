import React, { FC, useState } from "react"
import { Flex, Button, Box } from "theme-ui"
import Dialog from "../Dialog/Dialog"
import Typography from "../Typography/Typography"

import Spacer from "../Spacer/Spacer"
import LoadingIndicator from "../LoadingIndicator/LoadingIndicator"

import Input from "../Input/Input"
import { updateAreaApi } from "../../api/updateAreaApi"

interface Props {
  onDismiss: () => void
  onSaved: () => void
  areaId: string
  originalName: string
}
export const EditAreaDialog: FC<Props> = ({
  onDismiss,
  onSaved,
  areaId,
  originalName,
}) => {
  const [name, setName] = useState(originalName)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  const isValid = name !== originalName && name !== ""

  async function createArea(): Promise<void> {
    setLoading(true)
    setError(false)
    try {
      const response = await updateAreaApi(areaId, name)
      setLoading(false)
      if (response.status === 200) {
        onSaved()
      }
    } catch (e) {
      setError(true)
      setLoading(false)
    }
  }

  return (
    <Dialog sx={{ backgroundColor: "background" }}>
      <Flex
        sx={{
          flexDirection: "column",
        }}
      >
        <Flex
          backgroundColor="surface"
          sx={{
            alignItems: "center",
            position: "relative",
            borderBottomColor: "border",
            borderBottomWidth: 1,
            borderBottomStyle: "solid",
          }}
        >
          <Typography.H6
            sx={{
              width: "100%",
              position: "absolute",
              pointerEvents: "none",
              textAlign: "center",
              alignContent: "center",
            }}
          >
            Update Area
          </Typography.H6>
          <Button variant="outline" color="danger" m={2} onClick={onDismiss}>
            Cancel
          </Button>
          <Spacer />
          <Button m={2} disabled={!isValid || loading} onClick={createArea}>
            {loading && <LoadingIndicator />}
            Save
          </Button>
        </Flex>
        <Box px={3} pb={4} pt={3}>
          <Input
            disabled={loading}
            autoFocus
            label="Area name"
            sx={{ width: "100%" }}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {error && <ErrorMessage />}
        </Box>
      </Flex>
    </Dialog>
  )
}

const ErrorMessage: FC = () => (
  <Typography.Body
    color="warning"
    mt={3}
    p={1}
    sx={{
      width: "100%",
      fontSize: 1,
      textAlign: "center",
      borderRadius: "default",
      borderStyle: "solid",
      borderColor: "warning",
      borderWidth: 1,
    }}
  >
    Failed saving area, please try again.
  </Typography.Body>
)

export default EditAreaDialog
