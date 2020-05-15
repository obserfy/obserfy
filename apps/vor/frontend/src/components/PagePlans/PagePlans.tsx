import React, { FC, useState } from "react"
import dayjs from "../../dayjs"
import { Box } from "../Box/Box"
import Typography from "../Typography/Typography"
import { Flex } from "../Flex/Flex"
import { ReactComponent as PlusIcon } from "../../icons/plus.svg"
import Button from "../Button/Button"
import Icon from "../Icon/Icon"
import { ReactComponent as PrevIcon } from "../../icons/arrow-back.svg"
import { ReactComponent as NextIcon } from "../../icons/next-arrow.svg"
import useGetPlans from "../../api/useGetPlans"
import { Link } from "../Link/Link"
import { Card } from "../Card/Card"
import { NEW_PLANS_URL, PLANS_DETAILS_URL } from "../../routes"

export const PagePlans: FC = () => {
  const [selectedDate, setSelectedDate] = useState(dayjs())
  const { data } = useGetPlans(selectedDate.format("YYYY-MM-DD"))

  return (
    <Box maxWidth="maxWidth.sm" mx="auto">
      <Flex alignItems="center" mx={3} my={3}>
        <Typography.Body>
          {selectedDate.format("dddd, DD MMM 'YY")}
        </Typography.Body>
        <Button
          variant="outline"
          py={1}
          px={1}
          mr={1}
          ml="auto"
          onClick={() => setSelectedDate(selectedDate.add(-1, "day"))}
        >
          <Icon as={PrevIcon} m={0} />
        </Button>
        <Button
          variant="outline"
          mr={2}
          py={1}
          px={1}
          onClick={() => setSelectedDate(selectedDate.add(1, "day"))}
        >
          <Icon as={NextIcon} m={0} />
        </Button>
        <Button
          variant="outline"
          py={1}
          px={3}
          onClick={() => setSelectedDate(dayjs())}
        >
          today
        </Button>
      </Flex>
      {data?.map((plan) => {
        return (
          <Link to={PLANS_DETAILS_URL(plan.id)}>
            <Card p={3} borderRadius={[0, "default"]}>
              <Typography.Body fontSize={1}>{plan.title}</Typography.Body>
            </Card>
          </Link>
        )
      })}
      <Link to={NEW_PLANS_URL}>
        <Card
          p={3}
          borderRadius={[0, "default"]}
          sx={{ display: "flex", alignItems: "center" }}
        >
          <Icon as={PlusIcon} m={0} fill="primaryDark" />
          <Typography.Body ml={3} fontSize={1} color="textMediumEmphasis">
            Add plan
          </Typography.Body>
        </Card>
      </Link>
    </Box>
  )
}

export default PagePlans
