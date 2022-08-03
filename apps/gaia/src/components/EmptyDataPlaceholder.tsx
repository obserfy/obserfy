import Icon from "$components/Icon/Icon"
import { FC } from "react"

const EmptyDataPlaceholder: FC<{
  icon?: string
  title?: string
  subtitle?: string
}> = ({ icon, subtitle, title }) => (
  <div className="mt-8 mb-12 px-8 text-center">
    <Icon
      src={icon ?? "/icons/search.svg"}
      className="mx-auto !h-10 !w-10"
      color="bg-gray-400"
    />
    <h3 className="mt-2 font-medium text-gray-900">{title}</h3>
    <p className="mt-1 text-gray-500">{subtitle ?? "No results found"}</p>
  </div>
)

export default EmptyDataPlaceholder
