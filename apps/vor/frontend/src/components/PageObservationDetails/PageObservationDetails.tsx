import React, { FC, useState } from "react"
import { Box, Button, Flex } from "theme-ui"
import { t } from "@lingui/macro"
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
import usePatchObservation from "../../api/observations/usePatchObservation"
import LoadingIndicator from "../LoadingIndicator/LoadingIndicator"

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

  const callDeleteObservationApi = async () => {
    const result = await deleteObservation()
    if (result?.ok) navigate(backUrl)
  }

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
        <VisibleToGuardians
          observationId={observationId}
          originalValue={data?.visibleToGuardians ?? false}
        />
        <Button
          variant="outline"
          color="danger"
          ml="auto"
          mr={3}
          my={3}
          px={2}
          onClick={deleteDialog.show}
          sx={{ flexShrink: 0 }}
          data-cy="delete-observation"
        >
          <Icon as={TrashIcon} fill="danger" />
        </Button>
      </Flex>
      {deleteDialog.visible && (
        <AlertDialog
          title={t`Delete Observation?`}
          onNegativeClick={deleteDialog.hide}
          onDismiss={deleteDialog.hide}
          positiveText="Yes"
          loading={deleteObservationState.isLoading}
          body={t`"${
            data?.shortDesc ?? ""
          }" will be permanently deleted. Are you sure?`}
          onPositiveClick={callDeleteObservationApi}
        />
      )}
    </Box>
  )
}

const VisibleToGuardians: FC<{
  observationId: string
  originalValue: boolean
}> = ({ observationId, originalValue }) => {
  const [value, setValue] = useState(originalValue)
  const [patchObservation, { isLoading }] = usePatchObservation(
    observationId,
    () => setValue(originalValue)
  )

  const patchVisibleToGuardians = async (visibleToGuardians: boolean) => {
    setValue(visibleToGuardians)
    await patchObservation({ visibleToGuardians })
  }

  return (
    <Flex
      sx={{
        alignItems: "center",
        opacity: isLoading ? 0.5 : 1,
        transition: "opacity 200ms ease-in-out",
      }}
    >
      <Checkbox
        checked={value}
        label={t`Visible to guardians`}
        containerSx={{ ml: [3, 4] }}
        disabled={isLoading}
        onChange={patchVisibleToGuardians}
      />
      {isLoading && <LoadingIndicator />}
    </Flex>
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
