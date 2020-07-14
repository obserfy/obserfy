import React, { FC, useState } from "react"
import { Box, BoxProps, Card, Flex, Image, Input, Label } from "theme-ui"

import Typography from "../Typography/Typography"
import { ReactComponent as CameraIcon } from "../../icons/camera.svg"
import Icon from "../Icon/Icon"
import usePostNewImage from "../../api/schools/usePostNewImage"
import { LoadingIndicator } from "../LoadingIndicator/LoadingIndicator"

interface Props extends Omit<BoxProps, "onChange" | "value"> {
  onChange: (file?: File) => void
  value?: File
}
export const ProfilePicker: FC<Props> = ({ value, onChange, ...props }) => {
  const [mutate, { status }] = usePostNewImage()
  const [image, setImage] = useState<File>()

  return (
    <Box {...props} sx={{ flexShrink: 0 }}>
      <Label>
        <Card sx={{ height: 100, width: 100 }}>
          {image ? (
            <Image
              src={URL.createObjectURL(image)}
              sx={{
                height: "100%",
                width: "100%",
                objectFit: "cover",
                objectPosition: "center",
              }}
            />
          ) : (
            <Flex
              sx={{
                justifyContent: "center",
                flexDirection: "column",
                alignItems: "center",
                width: "100%",
                height: "100%",
              }}
            >
              {status === "loading" ? (
                <LoadingIndicator size={40} />
              ) : (
                <>
                  <Icon
                    as={CameraIcon}
                    m={0}
                    width={24}
                    height={24}
                    mb={1}
                    mt={3}
                  />
                  <Typography.Body
                    color="textMediumEmphasis"
                    sx={{ fontSize: 0 }}
                  >
                    Add Picture
                  </Typography.Body>
                </>
              )}
            </Flex>
          )}
        </Card>
        <Input
          sx={{ display: "none" }}
          type="file"
          onChange={async (e) => {
            const selectedImage = e.target.files?.[0]
            if (selectedImage) {
              const result = await mutate(selectedImage)
              if (result.ok) {
                setImage(selectedImage)
              }
            }
          }}
          disabled={status === "loading"}
        />
      </Label>
    </Box>
  )
}

export default ProfilePicker
