import React, { FC } from "react"
import { Box, BoxProps, Card, Flex, Image, Input, Label } from "theme-ui"
import { Trans } from "@lingui/macro"
import Typography from "../Typography/Typography"
import { ReactComponent as CameraIcon } from "../../icons/camera.svg"
import Icon from "../Icon/Icon"
import usePostNewImage from "../../api/schools/usePostNewImage"
import { LoadingIndicator } from "../LoadingIndicator/LoadingIndicator"
import useGetImage from "../../api/useGetImage"

interface Props extends Omit<BoxProps, "onChange" | "value"> {
  onChange: (imageId: string) => void
  value: string
}
export const ProfilePicker: FC<Props> = ({ value, onChange, ...props }) => {
  const [mutate, { status }] = usePostNewImage()
  const image = useGetImage(value)

  return (
    <Box {...props} sx={{ flexShrink: 0 }}>
      <Label>
        <Card sx={{ height: 100, width: 100, overflow: "hidden" }}>
          {image.status === "success" ? (
            <Image
              src={image.data?.url}
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
                  <Icon as={CameraIcon} width={24} height={24} mb={1} mt={3} />
                  <Typography.Body
                    color="textMediumEmphasis"
                    sx={{ fontSize: 0 }}
                  >
                    <Trans>Add Picture</Trans>
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
              if (result?.ok) {
                const response = await result.json()
                onChange(response.id)
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
