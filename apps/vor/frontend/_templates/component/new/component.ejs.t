---
to: src/components/<%= name%>/<%= name%>.tsx
---
import React, { FC } from "react"

export interface <%= name%>Props {}
export const <%= name%>: FC<<%= name%>Props> = () => (
  <div></div>
)

export default <%= name%>
