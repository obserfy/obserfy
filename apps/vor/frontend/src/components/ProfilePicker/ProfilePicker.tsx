import React, { ChangeEvent, FC, useState } from "react"
import { Input, Flex, BoxProps, Box, Label, Card, Image } from "theme-ui"

import Typography from "../Typography/Typography"
import { ReactComponent as CameraIcon } from "../../icons/camera.svg"
import Icon from "../Icon/Icon"
import WarningDialog from "../WarningDialog/WarningDialog"

interface Props extends Omit<BoxProps, "onChange" | "value"> {
  onChange: (file?: File) => void
  value?: File
}
export const ProfilePicker: FC<Props> = ({ value, onChange, ...props }) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  return (
    <Box {...props} sx={{ flexShrink: 0 }}>
      <Label
        onClick={() => {
          if (value) {
            setShowDeleteDialog(true)
          }
        }}
      >
        <Card sx={{ height: 100, width: 100 }}>
          {value ? (
            <Image
              src={URL.createObjectURL(value)}
              sx={{
                height: "100%",
                width: "100%",
                objectFit: "cover",
                objectPosition: "center",
              }}
            />
          ) : (
            <Flex
              pt={3}
              sx={{
                justifyContent: "center",
                flexDirection: "column",
                alignItems: "center",
                width: "100%",
                height: "100%",
              }}
            >
              <Icon as={CameraIcon} m={0} width={24} height={24} mb={1} />
              <Typography.Body
                color="textMediumEmphasis"
                sx={{
                  fontSize: 0,
                }}
              >
                Add Picture
              </Typography.Body>
            </Flex>
          )}
        </Card>
        <Input
          sx={{ display: "none" }}
          type="file"
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            onChange(e.target.files?.[0])
          }
          disabled={value !== undefined}
        />
      </Label>
      {showDeleteDialog && (
        <WarningDialog
          onDismiss={() => setShowDeleteDialog(false)}
          onAccept={() => {
            onChange(undefined)
            setShowDeleteDialog(false)
          }}
          title="Remove picture?"
          description="Do you want to remove this student's picture?"
        />
      )}
    </Box>
  )
}

export default ProfilePicker
