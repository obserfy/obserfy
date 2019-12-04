import React, { FC } from "react"
import { navigate } from "gatsby"
import Flex from "../Flex/Flex"
import Box from "../Box/Box"
import { useQueryAllSchools } from "../../hooks/students/useQueryAllSchool"
import Card from "../Card/Card"
import { Typography } from "../Typography/Typography"
import Icon from "../Icon/Icon"
import { ReactComponent as ArrowNextIcon } from "../../icons/next-arrow.svg"
import Spacer from "../Spacer/Spacer"
import { Button } from "../Button/Button"
import { ReactComponent as PlusIcon } from "../../icons/plus.svg"
import { setSchoolIdState } from "../../hooks/schoolIdState"

export const PageChooseSchool: FC = () => {
  const [schools] = useQueryAllSchools()

  function saveSelectedSchool(schoolId: string): void {
    setSchoolIdState(schoolId)
    navigate("/")
  }

  const availableSchools = schools?.map(({ id, name }) => (
    <Card
      onClick={() => saveSelectedSchool(id)}
      px={4}
      py={3}
      mb={2}
      sx={{
        cursor: "pointer",
      }}
    >
      <Flex alignItems="center">
        <Typography.H5 textAlign="center">{name}</Typography.H5>
        <Spacer />
        <Icon as={ArrowNextIcon} />
      </Flex>
    </Card>
  ))

  const emptySchoolPlaceholder = schools.length === 0 && (
    <Typography.H6 mb={4} mt={4}>
      You have not added any school yet
    </Typography.H6>
  )

  return (
    <Flex justifyContent="center" minHeight="100vh" minWidth="100vw" pt={6}>
      <Box p={3} maxWidth="maxWidth.sm" width="100%" mt={-5}>
        <Typography.H2 mb={4}>Your Schools</Typography.H2>
        {availableSchools}
        {emptySchoolPlaceholder}
        <Button
          mt={3}
          variant="outlineBig"
          width="100%"
          onClick={() => navigate("/new-school")}
        >
          <Icon as={PlusIcon} m={0} mr={2} />
          New school
        </Button>
      </Box>
    </Flex>
  )
}

export default PageChooseSchool
