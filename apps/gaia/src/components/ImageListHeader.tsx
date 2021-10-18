import clsx from "clsx"
import { FC } from "react"

const ImageListHeader: FC<{
  className?: string
}> = ({ className, children }) => (
  <p
    className={clsx(
      className,
      "flex sticky top-4 sm:top-20 z-10 flex-col items-center py-2 lg:py-3 px-4 mx-8 sm:mx-auto mb-2 sm:max-w-md font-semibold leading-none text-center text-gray-900 bg-white bg-opacity-80 rounded-full backdrop-filter backdrop-blur"
    )}
  >
    {children}
    <div className="mt-1 w-6 h-1 bg-primary-500 rounded-full" />
  </p>
)

export default ImageListHeader
