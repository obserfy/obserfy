import React, { FC } from "react"
import Box from "../Box/Box"
import BackNavigation from "../BackNavigation/BackNavigation"
import { useGetStudent } from "../../api/useGetStudent"
import Card from "../Card/Card"
import Typography from "../Typography/Typography"
import { STUDENT_DETAILS_PAGE_URL } from "../../routes"
import dayjs from "../../dayjs"
import { ReactComponent as PrevIcon } from "../../icons/edit.svg"
import Button from "../Button/Button"
import Icon from "../Icon/Icon"
import Flex from "../Flex/Flex"

interface Props {
  id: string
}
export const PageStudentProfile: FC<Props> = ({ id }) => {
  const { data } = useGetStudent(id)

  return (
    <Box maxWidth="maxWidth.sm" margin="auto">
      <BackNavigation
        to={STUDENT_DETAILS_PAGE_URL(id)}
        text="Student Overview"
      />
      <Card borderRadius={[0, "default"]} mb={3}>
        <DataBox label="Name" value={data?.name ?? ""} />
        <DataBox
          label="Gender"
          value={(() => {
            switch (data?.gender) {
              case 1:
                return "Male"
              case 2:
                return "Female"
              default:
                return "Not set"
            }
          })()}
        />
        <DataBox
          label="Student ID"
          value={data?.customId ? data.customId : "Not set"}
        />
        <DataBox
          label="Date of Birth"
          value={dayjs(data?.dateOfBirth).format("d MMMM YYYY")}
        />
        <DataBox
          label="Date of Entry"
          value={
            data?.dateOfEntry
              ? dayjs(data?.dateOfEntry).format("d MMMM YYYY")
              : "N/A"
          }
        />
      </Card>

      <Card borderRadius={[0, "default"]} mb={3}>
        <Flex sx={{ alignItems: "flex-start" }}>
          <Box px={3} py={3}>
            <Typography.Body
              fontSize={0}
              lineHeight={1}
              mb={2}
              color="textMediumEmphasis"
            >
              Classes
            </Typography.Body>
            {data?.classes?.length === 0 && (
              <Typography.Body lineHeight={1}>Not set</Typography.Body>
            )}
            {data?.classes?.map(() => {
              return <Typography.Body lineHeight={1}>Name</Typography.Body>
            })}
          </Box>

          <Button variant="outline" ml="auto" px={2} mt={3} mr={3}>
            <Icon as={PrevIcon} m={0} />
          </Button>
        </Flex>
      </Card>

      <Card borderRadius={[0, "default"]}>
        <Flex sx={{ alignItems: "flex-start" }}>
          <Box px={3} py={3}>
            <Typography.Body
              fontSize={0}
              lineHeight={1}
              mb={2}
              color="textMediumEmphasis"
            >
              Guardians
            </Typography.Body>
            {data?.guardians?.length === 0 && (
              <Typography.Body lineHeight={1}>Not set</Typography.Body>
            )}
            {data?.guardians?.map(() => {
              return <Typography.Body lineHeight={1}>Name</Typography.Body>
            })}
          </Box>
          <Button variant="outline" ml="auto" px={2} mt={3} mr={3}>
            <Icon as={PrevIcon} m={0} />
          </Button>
        </Flex>
      </Card>
    </Box>
  )
}

const DataBox: FC<{ label: string; value: string }> = ({ label, value }) => (
  <Flex
    px={3}
    py={3}
    sx={{
      borderBottomWidth: 1,
      borderBottomColor: "border",
      borderBottomStyle: "solid",
      alignItems: "center",
    }}
  >
    <Box>
      <Typography.Body
        fontSize={0}
        lineHeight={1}
        mb={2}
        color="textMediumEmphasis"
      >
        {label}
      </Typography.Body>
      <Typography.Body lineHeight={1}>{value}</Typography.Body>
    </Box>
    <Button variant="outline" ml="auto" px={2}>
      <Icon as={PrevIcon} m={0} />
    </Button>
  </Flex>
)

export default PageStudentProfile
