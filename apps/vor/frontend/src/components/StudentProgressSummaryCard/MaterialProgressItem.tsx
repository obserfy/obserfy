import React, { FC } from "react"
import {
  MaterialProgress,
  materialStageToString,
} from "../../api/useGetStudentMaterialProgress"
import Flex from "../Flex/Flex"
import Typography from "../Typography/Typography"
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
      <Typography.Body fontSize={1} lineHeight={1.8} mr={3}>
        {value.materialName}
      </Typography.Body>
      <Pill
        backgroundColor={`materialStage.${stage.toLowerCase()}`}
        text={stage}
        mr={2}
        ml="auto"
      />
      <Icon as={NextIcon} m={0} />
    </Flex>
  )
}
export default MaterialProgressItem
