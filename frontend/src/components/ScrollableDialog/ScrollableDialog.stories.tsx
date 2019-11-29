import React, { FC, useState } from "react"
import ScrollableDialog from "./ScrollableDialog"
import Typography from "../Typography/Typography"
import SearchBar from "../SearchBar/SearchBar"
import Box from "../Box/Box"

export default {
  title: "Basic|Dialog/ScrollableDialog",
  component: ScrollableDialog,
  parameters: {
    componentSubtitle: "Just a simple ScrollableDialog"
  }
}

const locationList = [
  "Chicago",
  "New York",
  "Seattle",
  "New Hope",
  "Ordinary",
  "Milan",
  "Paris",
  "Svalbard"
]

export const Basic: FC = () => {
  const [filter, setFilter] = useState("")
  return (
    <ScrollableDialog
      negativeText="No"
      positiveText="Confirm"
      title="Where do you want to live?"
    >
      <Box px={3}>
        <SearchBar onChange={e => setFilter(e.target.value)} value={filter} />
        {[...locationList]
          .filter(location => location.includes(filter))
          .map(location => (
            <Typography.Body p={3} mb={0} key={location}>
              {location}
            </Typography.Body>
          ))}
      </Box>
    </ScrollableDialog>
  )
}
