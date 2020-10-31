import React, { FC } from "react"
import { Box, Button, Flex } from "theme-ui"
import useGetObservation from "../../api/observations/useGetObservation"
import LoadingPlaceholder from "../LoadingPlaceholder/LoadingPlaceholder"
import Icon from "../Icon/Icon"
import { ReactComponent as TrashIcon } from "../../icons/trash.svg"
import { navigate } from "../Link/Link"
import useVisibilityState from "../../hooks/useVisibilityState"
import ImageCard from "./ImageCard"
import ObservationMetaCard from "./ObservationMetaCard"
import AlertDialog from "../AlertDialog/AlertDialog"
import useDeleteObservation from "../../api/observations/useDeleteObservation"
import Checkbox from "../Checkbox/Checkbox"
import DetailsCard from "./DetailsCard"

export interface PageObservationDetailsProps {
  observationId: string
  studentId: string
  backUrl: string
}
export const PageObservationDetails: FC<PageObservationDetailsProps> = ({
  observationId,
  studentId,
  backUrl,
}) => {
  const deleteDialog = useVisibilityState()
  const { data, isLoading } = useGetObservation(observationId)
  const [deleteObservation, deleteObservationState] = useDeleteObservation(
    observationId,
    studentId
  )

  if (isLoading) {
    return <Loading />
  }

  return (
    <Box>
      <ObservationMetaCard observationId={observationId} />

      <DetailsCard
        originalValue={data?.longDesc ?? ""}
        observationId={observationId}
      />

      <ImageCard
        studentId={studentId}
        observationId={observationId}
        originalValue={data?.images ?? []}
      />

      <Flex sx={{ alignItems: "center" }}>
        <Checkbox
          defaultChecked={data?.visibleToGuardians}
          label="Visible to Guardians"
          containerSx={{ mx: [3, 4] }}
        />
        <Button
          variant="outline"
          color="danger"
          ml="auto"
          mr={3}
          my={3}
          onClick={deleteDialog.show}
          sx={{ flexShrink: 0 }}
        >
          <Icon as={TrashIcon} fill="danger" mr={2} />
          Delete
        </Button>
      </Flex>
      {deleteDialog.visible && (
        <AlertDialog
          title="Delete Observation?"
          onNegativeClick={deleteDialog.hide}
          onDismiss={deleteDialog.hide}
          loading={deleteObservationState.isLoading}
          body={`"${
            data?.shortDesc ?? ""
          }" will be permanently deleted. Are you sure?`}
          onPositiveClick={async () => {
            const result = await deleteObservation()
            if (result?.ok) navigate(backUrl)
          }}
        />
      )}
    </Box>
  )
}

const Loading = () => (
  <Box mx={3}>
    <LoadingPlaceholder sx={{ height: 210 }} mb={2} />
    <LoadingPlaceholder sx={{ height: 150 }} mb={2} />
    <LoadingPlaceholder sx={{ height: 92 }} mb={2} />
  </Box>
)

export default PageObservationDetails
