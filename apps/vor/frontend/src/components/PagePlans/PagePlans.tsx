import React, { FC, useState } from "react"
import dayjs from "../../dayjs"
import { Box } from "../Box/Box"
import Typography from "../Typography/Typography"
import { Flex } from "../Flex/Flex"
import Button from "../Button/Button"
import Icon from "../Icon/Icon"
import { ReactComponent as PrevIcon } from "../../icons/arrow-back.svg"
import { ReactComponent as NextIcon } from "../../icons/next-arrow.svg"

export const PagePlans: FC = () => {
  const [currentDate, setCurrentDate] = useState(dayjs)

  return (
    <Box>
      <Flex alignItems="flex-end" mx={3} my={4}>
        <Typography.H6>May 2020</Typography.H6>
        <Button variant="outline" py={1} px={1} mr={1} ml="auto">
          <Icon as={PrevIcon} m={0} />
        </Button>
        <Button variant="outline" mr={2} py={1} px={1}>
          <Icon as={NextIcon} m={0} />
        </Button>
        <Button variant="outline" py={1} px={3}>
          today
        </Button>
      </Flex>
    </Box>
  )
}

export default PagePlans
