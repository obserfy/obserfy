import { useBreakpointIndex } from "@theme-ui/match-media"
import { FC } from "react"
import { borderBottom } from "../../border"
import TopBar, { BreadcrumbData } from "../TopBar/TopBar"
import TranslucentBar from "../TranslucentBar/TranslucentBar"

export interface CurriculumTopBarProps {
  breadcrumbs: BreadcrumbData[]
}
const CurriculumTopBar: FC<CurriculumTopBarProps> = ({ breadcrumbs }) => {
  const breakpoint = useBreakpointIndex({ defaultIndex: 3 })

  if (breakpoint < 2) return <></>

  return (
    <TranslucentBar
      boxSx={{ display: ["none", "none", "flex"], ...borderBottom }}
    >
      <TopBar breadcrumbs={breadcrumbs} />
    </TranslucentBar>
  )
}

export default CurriculumTopBar
