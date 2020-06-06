/** @jsx jsx */
import { FC, useState } from "react"
import { jsx } from "theme-ui"
import dayjs from "../../dayjs"
import { Box } from "../Box/Box"
import Typography from "../Typography/Typography"
import { Flex } from "../Flex/Flex"
import { ReactComponent as PlusIcon } from "../../icons/plus.svg"
import Button from "../Button/Button"
import Icon from "../Icon/Icon"
import { ReactComponent as PrevIcon } from "../../icons/arrow-back.svg"
import { ReactComponent as NextIcon } from "../../icons/next-arrow.svg"
import useGetPlans from "../../api/plans/useGetPlans"
import { Link } from "../Link/Link"
import { Card } from "../Card/Card"
import { NEW_PLANS_URL, PLANS_DETAILS_URL } from "../../routes"

export const PagePlans: FC = () => {
  const [selectedDate, setSelectedDate] = useState(dayjs())
  const { data } = useGetPlans(selectedDate)

  return (
    <Box maxWidth="maxWidth.sm" mx="auto">
      <Flex alignItems="center" mx={3} my={3}>
        <Typography.Body sx={{ fontSize: 1 }}>
          {selectedDate.format("ddd, DD MMM 'YY")}
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
          disabled={selectedDate.isSame(dayjs(), "day")}
        >
          Today
        </Button>
      </Flex>
      {data?.map((plan) => {
        return (
          <Link
            to={PLANS_DETAILS_URL(plan.id)}
            sx={{ display: "block", mx: [0, 3], mb: [0, 2] }}
          >
            <Card p={3} borderRadius={[0, "default"]}>
              <Typography.Body fontSize={1}>{plan.title}</Typography.Body>
            </Card>
          </Link>
        )
      })}
      <Link
        to={`${NEW_PLANS_URL}?date=${selectedDate.format("YYYY-MM-DD")}`}
        sx={{ display: "block", mx: [0, 3] }}
      >
        <Card
          px={3}
          py={2}
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
