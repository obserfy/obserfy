import { ChangeEventHandler, FC } from "react"
import { Box, BoxProps, Card, Flex, Image, Input, Label } from "theme-ui"
import { Trans } from "@lingui/macro"
import Typography from "../Typography/Typography"
import { ReactComponent as CameraIcon } from "../../icons/camera.svg"
import Icon from "../Icon/Icon"
import usePostNewImage from "../../hooks/api/schools/usePostNewImage"
import { LoadingIndicator } from "../LoadingIndicator/LoadingIndicator"
import useGetImage from "../../hooks/api/useGetImage"

interface Props extends Omit<BoxProps, "onChange" | "value" | "css"> {
  onChange: (imageId: string) => void
  value: string
}

export const ProfilePicker: FC<Props> = ({ value, onChange, ...props }) => {
  const postNewImage = usePostNewImage()
  const image = useGetImage(value)

  const handleImageUpload: ChangeEventHandler<HTMLInputElement> = async (
    event
  ) => {
    try {
      const selectedImage = event.target.files?.[0]
      if (!selectedImage) return
      const result = await postNewImage.mutateAsync(selectedImage)
      if (!result?.ok) return
      const response = await result.json()
      onChange(response.id)
    } catch (e) {
      Sentry.captureException(e)
    }
  }

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
              {postNewImage.isLoading ? (
                <LoadingIndicator size={40} />
              ) : (
                <>
                  <Icon as={CameraIcon} width={24} height={24} mb={1} />
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
          data-cy="upload-profile-pic"
          sx={{ display: "none" }}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          disabled={postNewImage.isLoading}
        />
      </Label>
    </Box>
  )
}

export default ProfilePicker
