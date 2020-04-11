import React, { FC, useState } from "react"
import Dialog from "../Dialog/Dialog"
import Typography from "../Typography/Typography"
import Button from "../Button/Button"
import Flex from "../Flex/Flex"
import { GuardianRelationship } from "../../api/students/usePostNewStudent"
import Select from "../Select/Select"
import Box from "../Box/Box"

interface Props {
  onDismiss: () => void
  onAccept: (newRelationship: GuardianRelationship) => void
  defaultValue?: GuardianRelationship
}
export const GuardianRelationshipPickerDialog: FC<Props> = ({
  onDismiss,
  onAccept,
  defaultValue,
}) => {
  const [relationship, setRelationship] = useState(
    defaultValue ?? GuardianRelationship.Other
  )

  return (
    <Dialog>
      <Flex
        alignItems="center"
        backgroundColor="surface"
        sx={{
          justifyContent: "space-between",
          flexShrink: 0,
          position: "relative",
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
          Relationship
        </Typography.H6>
        <Button
          variant="outline"
          m={2}
          onClick={onDismiss}
          sx={{ flexShrink: 0 }}
        >
          Cancel
        </Button>
        <Button
          ml="auto"
          m={2}
          backgroundColor="danger"
          onClick={() => onAccept(relationship)}
        >
          Set
        </Button>
      </Flex>
      <Box backgroundColor="background" p={3}>
        <Select
          label="Relationship"
          mb={2}
          onChange={(e) => setRelationship(parseInt(e.target.value, 10))}
          value={relationship}
        >
          <option value={GuardianRelationship.Other}>Other</option>
          <option value={GuardianRelationship.Mother}>Mother</option>
          <option value={GuardianRelationship.Father}>Father</option>
        </Select>
      </Box>
    </Dialog>
  )
}

export default GuardianRelationshipPickerDialog
