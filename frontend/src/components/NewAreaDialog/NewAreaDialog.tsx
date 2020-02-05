import React, { FC } from "react"
import Dialog from "../Dialog/Dialog"
import Input from "../Input/Input"
import Flex from "../Flex/Flex"
import Button from "../Button/Button"
import Typography from "../Typography/Typography"
import Box from "../Box/Box"
import Spacer from "../Spacer/Spacer"

interface Props {
  onDismiss: () => void
  onSaved: () => void
}
export const NewAreaDialog: FC<Props> = ({ onDismiss }) => {
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
          <Spacer/>
          <Button m={2}>Save</Button>
        </Flex>
        <Box px={3} pb={4} pt={3}>
          <Input label="Area Name" width="100%"/>
        </Box>
      </Flex>
    </Dialog>
  )
}

export default NewAreaDialog
