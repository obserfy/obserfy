import { FC } from "react"
import { Box } from "theme-ui"
import { borderBottom } from "../../border"
import { range } from "../../domain/array"
import LoadingPlaceholder from "../LoadingPlaceholder/LoadingPlaceholder"

const CurriculumListLoadingPlaceholder: FC<{
  length?: number
}> = ({ length = 2 }) => (
  <>
    {range(length).map(() => (
      <>
        <Box sx={{ ...borderBottom }}>
          <LoadingPlaceholder m={3} sx={{ height: 21, width: 100 }} />
        </Box>
        <Box sx={{ ...borderBottom }}>
          <LoadingPlaceholder m={3} sx={{ height: 21, width: 200 }} />
        </Box>
        <Box sx={{ ...borderBottom }}>
          <LoadingPlaceholder m={3} sx={{ height: 21, width: 150 }} />
        </Box>
      </>
    ))}
  </>
)

export default CurriculumListLoadingPlaceholder
