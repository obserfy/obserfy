---
to: src/components/<%= name%>/<%= name%>.stories.tsx
---
import React, { FC } from "react"
import <%= name %> from "./<%= name %>"

export default {
  title: "Core|<%= name %>",
  component: <%= name %>,
  parameters: {
    componentSubtitle: "Just a simple <%= name %>"
  }
}

export const Basic: FC = () => <<%= name%> />
