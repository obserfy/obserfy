import React, { FC } from "react"
import { Box } from "theme-ui"
import useGetObservation from "../../api/observations/useGetObservation"

export interface PageObservationDetailsProps {
  observationId: string
}
export const PageObservationDetails: FC<PageObservationDetailsProps> = ({
  observationId,
}) => {
  const observation = useGetObservation(observationId)

  return (
    <Box mx="auto" sx={{ maxWidth: "maxWidth.tm" }}>
      {observation.data?.id}
    </Box>
  )
}

export default PageObservationDetails
