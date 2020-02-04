import React, { FC } from "react"
import Dialog from "../Dialog/Dialog"
import Input from "../Input/Input"
import Flex from "../Flex/Flex"
import Button from "../Button/Button"
import Typography from "../Typography/Typography"
import Box from "../Box/Box"

export const NewAreaDialog: FC = () => (
  <Dialog backgroundColor="background">
    <Flex flexDirection="column">
      <Flex
        py={2}
        px={2}
        alignItems="center"
        backgroundColor="surface"
        sx={{
          borderBottomColor: "border",
          borderBottomWidth: 1,
          borderBottomStyle: "solid",
        }}
      >
        <Button variant="outline" color="danger">
          Cancel
        </Button>
        <Typography.H6 width="100%" sx={{ textAlign: "center" }}>
          New Area
        </Typography.H6>
        <Button>Save</Button>
      </Flex>
      <Box p={3} pt={2}>
        <Input label="Area Name" width="100%" />
      </Box>
    </Flex>
  </Dialog>
)

export default NewAreaDialog
