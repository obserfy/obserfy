import React, { FC } from "react"

export interface Observation {
  shortDesc: string
  longDesc: string
}
interface Props {
  id: string
}
export const PageEditStudent: FC<Props> = ({ id }) => {
  return <>{id}</>
}

export default PageEditStudent
