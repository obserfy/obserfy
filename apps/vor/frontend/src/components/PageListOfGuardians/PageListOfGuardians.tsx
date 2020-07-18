/** @jsx jsx */
import { FC, useState } from "react"
import { Box, Button, Card, Flex, jsx } from "theme-ui"
import BackNavigation from "../BackNavigation/BackNavigation"
import {
  SETTINGS_URL,
  NEW_GUARDIAN_ADMIN_URL,
  GUARDIAN_PROFILE_URL,
} from "../../routes"
import Typography from "../Typography/Typography"
import { useGetSchoolGuardians } from "../../api/guardians/useGetSchoolGuardians"
import { ReactComponent as PlusIcon } from "../../icons/plus.svg"

import Icon from "../Icon/Icon"
import { Link } from "../Link/Link"
import SearchBar from "../SearchBar/SearchBar"

export const PageListOfGuardians: FC = () => {
  const guardians = useGetSchoolGuardians()
  const [searchTerm, setSearchTerm] = useState("")
  const filteredGuardians = guardians.data?.filter((guardian) =>
    guardian.name.match(new RegExp(searchTerm, "i"))
  )

  return (
    <Box
      sx={{
        flexDirection: "column",
        maxWidth: "maxWidth.md",
      }}
      mx="auto"
    >
      <BackNavigation to={SETTINGS_URL} text="Settings" />
      <Typography.H5 m={3} sx={{ lineHeight: 1 }}>
        All Guardians
      </Typography.H5>
      <Flex p={3} pb={2} pt={2}>
        <SearchBar
          mr={2}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Link to={NEW_GUARDIAN_ADMIN_URL} style={{ flexShrink: 0 }}>
          <Button
            variant="outline"
            data-cy="addGuardian"
            sx={{
              height: "100%",
            }}
          >
            <Icon as={PlusIcon} m={0} />
          </Button>
        </Link>
      </Flex>
      {filteredGuardians?.map(({ id, name }) => (
        <GuardianCard key={id} guardianId={id} name={name} />
      ))}
    </Box>
  )
}

const GuardianCard: FC<{
  guardianId: string
  name: string
}> = ({ guardianId, name }) => {
  return (
    <Link to={GUARDIAN_PROFILE_URL(guardianId)} sx={{ display: "block" }}>
      <Card
        p={3}
        mx={[0, 3]}
        mb={[0, 2]}
        sx={{
          backgroundColor: ["background", "surface"],
          borderRadius: [0, "default"],
          cursor: "pointer",
          boxShadow: ["none", "low"],
          display: "flex",
          alignItems: "center",
        }}
      >
        <Flex sx={{ flexDirection: "column", alignItems: "start" }}>
          <Typography.Body ml={3} mb={2} sx={{ lineHeight: 1.6 }}>
            {name}
          </Typography.Body>
        </Flex>
      </Card>
    </Link>
  )
}

export default PageListOfGuardians
