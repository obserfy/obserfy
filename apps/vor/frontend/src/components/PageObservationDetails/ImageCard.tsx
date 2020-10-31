/** @jsx jsx */
import { Image, Card, Flex, jsx, Label } from "theme-ui"
import { FC, Fragment, useState } from "react"
import Typography from "../Typography/Typography"
import usePostNewObservationImage from "../../api/observations/usePostNewObservationImage"
import { borderFull } from "../../border"
import LoadingIndicator from "../LoadingIndicator/LoadingIndicator"
import Icon from "../Icon/Icon"
import { ReactComponent as PlusIcon } from "../../icons/plus.svg"
import ImagePreviewOverlay from "../ImagePreviewOverlay/ImagePreviewOverlay"

interface ImageData {
  id: string
  thumbnailUrl: string
  originalUrl: string
}

interface Props {
  studentId: string
  observationId: string
  originalValue: ImageData[]
}
const ImageCard: FC<Props> = ({ originalValue, studentId, observationId }) => (
  <Card sx={{ borderRadius: [0, "default"] }} mx={[0, 3]} pt={3}>
    <Typography.Body
      mb={2}
      color="textMediumEmphasis"
      sx={{ lineHeight: 1, fontSize: [1, 0] }}
      px={3}
    >
      Images
    </Typography.Body>
    <ImagesDataBox
      studentId={studentId}
      observationId={observationId}
      images={originalValue}
    />
  </Card>
)

const ImagesDataBox: FC<{
  studentId: string
  images: ImageData[]
  observationId: string
}> = ({ studentId, images, observationId }) => {
  const [selectedIdx, setSelectedIdx] = useState<number>()
  const [postNewImage, { isLoading }] = usePostNewObservationImage(
    observationId
  )
  const selectedImage =
    selectedIdx !== undefined ? images[selectedIdx] : undefined

  return (
    <Fragment>
      <Flex px={3} mb={2} sx={{ flexWrap: "wrap", alignItems: "center" }}>
        {images.map((image, idx) => {
          const isSelected = selectedIdx === idx
          return (
            <Image
              key={image.id}
              src={image.thumbnailUrl}
              mr={2}
              mb={2}
              sx={{
                height: "40px",
                width: "40px",
                borderRadius: "default",
                cursor: "pointer",
                boxShadow: isSelected ? "0 0 0 2px #00a875" : "",
                ...borderFull,
              }}
              onClick={() => setSelectedIdx(isSelected ? undefined : idx)}
            />
          )
        })}
        <Label
          mb={2}
          sx={{
            height: "40px",
            width: "40px",
            backgroundColor: "background",
            borderRadius: "default",
            cursor: "pointer",
            "&:hover": { borderColor: "primary" },
            opacity: isLoading ? 0.5 : 1,
            ...borderFull,
          }}
          variant="outline"
          p={0}
        >
          <input
            type="file"
            sx={{ display: "none" }}
            accept="image/*"
            disabled={isLoading}
            onChange={async (e) => {
              if (e.target.files) {
                await postNewImage(e.target.files[0])
              }
            }}
          />
          {isLoading ? (
            <LoadingIndicator m="auto" />
          ) : (
            <Icon as={PlusIcon} m="auto" />
          )}
        </Label>
      </Flex>
      {selectedIdx !== undefined && (
        <ImagePreviewOverlay
          imageId={selectedImage?.id ?? ""}
          studentId={studentId}
          src={selectedImage?.originalUrl ?? ""}
          onDismiss={() => setSelectedIdx(undefined)}
        />
      )}
    </Fragment>
  )
}

export default ImageCard
