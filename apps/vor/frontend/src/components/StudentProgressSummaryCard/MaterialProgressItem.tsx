import React, { FC } from "react"
import { Flex } from "theme-ui"
import {
  MaterialProgress,
  materialStageToString,
} from "../../api/useGetStudentMaterialProgress"
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
      sx={{ cursor: "pointer", alignItems: "center" }}
    >
      <Typography.Body sx={{ fontSize: 1, lineHeight: 1.8 }} mr={3}>
        {value.materialName}
      </Typography.Body>
      <Pill
        color={`materialStage.on${stage}`}
        backgroundColor={`materialStage.${stage.toLowerCase()}`}
        text={stage}
        mr={2}
        ml="auto"
      />
      <Icon as={NextIcon} />
    </Flex>
  )
}
export default MaterialProgressItem
