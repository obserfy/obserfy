import Image from "next/image"
import { FC } from "react"
import { Dayjs } from "../../utils/dayjs"

interface Props {
  loading: boolean
  date: Dayjs
  imageSrc: string
  text: string
  imageSize?: number
}
const EmptyPlaceholder: FC<Props> = ({
  imageSrc,
  loading,
  text,
  imageSize = 200,
}) => (
  <div
    className={`
      flex flex-col items-center py-16 ${loading && "opacity-50"} 
      transition-opacity duration-200 max-w-3xl mx-auto
    `}
  >
    <Image
      src={imageSrc}
      className="w-64 md:w-1/2 mb-3"
      width={imageSize}
      height={imageSize}
    />
    <h5
      className={`
        text-xl mx-4 text-center ${loading && "opacity-0"} 
        transition-opacity duration-200 font-bold
      `}
    >
      {text}
    </h5>
  </div>
)

export default EmptyPlaceholder
