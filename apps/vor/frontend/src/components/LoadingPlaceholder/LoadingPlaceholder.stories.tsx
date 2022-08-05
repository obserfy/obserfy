import { FC } from "react"
import LoadingPlaceholder from "./LoadingPlaceholder"

export default {
  title: "Core/LoadingPlaceholder",
  component: LoadingPlaceholder,
  parameters: {
    componentSubtitle: "Just a simple LoadingPlaceholder",
  },
}

export const Basic: FC = () => (
  <LoadingPlaceholder sx={{ width: 100, height: 100 }} />
)
