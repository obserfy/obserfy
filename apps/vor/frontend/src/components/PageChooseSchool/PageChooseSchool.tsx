import React, { FC } from "react"
import { navigate } from "gatsby"
import { Flex, Box, Card } from "theme-ui"

import { useGetSchools } from "../../api/schools/useGetSchools"

import { Typography } from "../Typography/Typography"
import Icon from "../Icon/Icon"
import { ReactComponent as ArrowNextIcon } from "../../icons/next-arrow.svg"
import Spacer from "../Spacer/Spacer"
import { Button } from "../Button/Button"
import { ReactComponent as PlusIcon } from "../../icons/plus.svg"
import { setSchoolIdState } from "../../hooks/schoolIdState"
import { STUDENTS_URL } from "../../routes"

export const PageChooseSchool: FC = () => {
  const [schools] = useGetSchools()

  function saveSelectedSchool(schoolId: string): void {
    setSchoolIdState(schoolId)
    navigate(STUDENTS_URL)
  }

  const availableSchools = schools?.map(({ id, name }) => (
    <Card
      key={id}
      onClick={() => saveSelectedSchool(id)}
      p={3}
      mb={2}
      sx={{
        cursor: "pointer",
      }}
      data-cy="school_item"
    >
      <Flex sx={{ alignItems: "center" }}>
        <Typography.H6 sx={{ textAlign: "left" }}>{name}</Typography.H6>
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
    <Flex
      sx={{
        justifyContent: "center",
        minHeight: "100vh",
        minWidth: "100vw",
      }}
      pt={6}
    >
      <Box p={3} sx={{ maxWidth: "maxWidth.sm", width: "100%" }} mt={-5}>
        <Typography.H2 mb={4}>Your Schools</Typography.H2>
        {availableSchools}
        {emptySchoolPlaceholder}
        <Button
          mt={3}
          variant="outlineBig"
          sx={{ width: "100%" }}
          onClick={() => navigate("/new-school")}
          data-cy="newSchool"
        >
          <Icon as={PlusIcon} m={0} mr={2} />
          New school
        </Button>
      </Box>
    </Flex>
  )
}

export default PageChooseSchool
