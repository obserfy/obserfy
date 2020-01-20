import React, { FC } from "react"
import {
  MaterialProgress,
  materialStageToString,
} from "../../api/useGetStudentMaterialProgress"
import Flex from "../Flex/Flex"
import Typography from "../Typography/Typography"
import Spacer from "../Spacer/Spacer"
import Pill from "../Pill/Pill"
import Icon from "../Icon/Icon"
import { ReactComponent as NextIcon } from "../../icons/next-arrow.svg"

interface Props {
  value: MaterialProgress
  onClick: () => void
}
const MaterialProgressItem: FC<Props> = ({ value, onClick }) => {
  const stage = materialStageToString(value.stage)
  return (
    <Flex
      px={3}
      py={2}
      onClick={onClick}
      alignItems="center"
      sx={{ cursor: "pointer" }}
    >
      <Typography.Body>{value.materialName}</Typography.Body>
      <Spacer />
      <Pill
        backgroundColor={`materialStage.${stage.toLowerCase()}`}
        text={stage}
        mr={2}
      />
      <Icon as={NextIcon} m={0} />
    </Flex>
  )
}
export default MaterialProgressItem
