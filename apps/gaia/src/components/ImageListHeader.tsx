import clsx from "clsx"
import { FC } from "react"

const ImageListHeader: FC<{
  className?: string
}> = ({ className, children }) => (
  <p
    className={clsx(
      className,
      "sticky top-4 z-10 mx-8 mb-2 flex flex-col items-center rounded-full bg-white bg-opacity-80 py-2 px-4 text-center font-semibold leading-none text-gray-900 backdrop-blur sm:top-20 sm:mx-auto sm:max-w-md lg:py-3"
    )}
  >
    {children}
    <span className="mt-1 h-1 w-6 rounded-full bg-primary-500" />
  </p>
)

export default ImageListHeader
