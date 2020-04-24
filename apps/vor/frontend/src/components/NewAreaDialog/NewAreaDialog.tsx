import React, { FC, useState } from "react"
import Dialog from "../Dialog/Dialog"
import Input from "../Input/Input"
import Flex from "../Flex/Flex"
import Button from "../Button/Button"
import Typography from "../Typography/Typography"
import Box from "../Box/Box"
import Spacer from "../Spacer/Spacer"
import LoadingIndicator from "../LoadingIndicator/LoadingIndicator"
import { createAreaApi } from "../../api/createAreaApi"

interface Props {
  curriculumId: string
  onDismiss: () => void
  onSaved: () => void
}
export const NewAreaDialog: FC<Props> = ({
  onSaved,
  onDismiss,
  curriculumId,
}) => {
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  async function createArea(): Promise<void> {
    setLoading(true)
    setError(false)
    try {
      const response = await createAreaApi(name, curriculumId)
      if (response.status === 201) {
        onSaved()
      }
    } catch (e) {
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog backgroundColor="background">
      <Flex flexDirection="column">
        <Flex
          alignItems="center"
          backgroundColor="surface"
          sx={{
            position: "relative",
            borderBottomColor: "border",
            borderBottomWidth: 1,
            borderBottomStyle: "solid",
          }}
        >
          <Typography.H6
            width="100%"
            sx={{
              position: "absolute",
              pointerEvents: "none",
              textAlign: "center",
              alignContent: "center",
            }}
          >
            New Area
          </Typography.H6>
          <Button variant="outline" color="danger" m={2} onClick={onDismiss}>
            Cancel
          </Button>
          <Spacer />
          <Button m={2} disabled={name === "" || loading} onClick={createArea}>
            {loading && <LoadingIndicator />}
            Save
          </Button>
        </Flex>
        <Box px={3} pb={4} pt={3}>
          {error && <ErrorMessage />}
          <Input
            disabled={loading}
            autoFocus
            label="Area name"
            width="100%"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Box>
      </Flex>
    </Dialog>
  )
}

const ErrorMessage: FC = () => (
  <Typography.Body
    color="warning"
    width="100%"
    mb={2}
    fontSize={1}
    textAlign="center"
    p={1}
    sx={{
      borderRadius: "default",
      borderStyle: "solid",
      borderColor: "warning",
      borderWidth: 1,
    }}
  >
    Failed saving area, please try again.
  </Typography.Body>
)

export default NewAreaDialog
