import React from "react"
import { Meta, Story } from "@storybook/react"
import { Box, Flex } from "theme-ui"
import TranslucentBar, { TranslucentBarProps } from "./TranslucentBar"

export default {
  title: "Core/TranslucentBar",
  component: TranslucentBar,
  parameters: {
    componentSubtitle: "Just a simple TranslucentBar",
  },
} as Meta

const Template: Story<TranslucentBarProps> = () => {
  return (
    <Box>
      <TranslucentBar
        boxSx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
        }}
      >
        <Flex sx={{ justifyContent: "space-around" }}>
          <Box m={3}>One</Box>
          <Box m={3}>Two</Box>
          <Box m={3}>Three</Box>
        </Flex>
      </TranslucentBar>
      <Flex>
        <Box backgroundColor="red" sx={{ height: 300, width: 100 }} />
        <Box backgroundColor="yellow" sx={{ height: 300, width: 100 }} />
        <Box backgroundColor="green" sx={{ height: 300, width: 100 }} />
        <Box backgroundColor="blue" sx={{ height: 300, width: 100 }} />
      </Flex>
      <Flex>
        <Box backgroundColor="blue" sx={{ height: 300, width: 100 }} />
        <Box backgroundColor="red" sx={{ height: 300, width: 100 }} />
        <Box backgroundColor="green" sx={{ height: 300, width: 100 }} />
        <Box backgroundColor="yellow" sx={{ height: 300, width: 100 }} />
      </Flex>
      <Flex>
        <Box backgroundColor="red" sx={{ height: 300, width: 100 }} />
        <Box backgroundColor="yellow" sx={{ height: 300, width: 100 }} />
        <Box backgroundColor="blue" sx={{ height: 300, width: 100 }} />
        <Box backgroundColor="green" sx={{ height: 300, width: 100 }} />
      </Flex>
    </Box>
  )
}

export const Default = Template.bind({})
Default.args = {}
