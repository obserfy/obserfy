import Image from "next/image"
import { FC } from "react"
import { Dayjs } from "$lib/dayjs"

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
      mx-auto max-w-3xl transition-opacity duration-200
    `}
  >
    <Image
      src={imageSrc}
      className="mb-3 w-64 md:w-1/2"
      width={imageSize}
      height={imageSize}
      alt={""}
      style={{
        maxWidth: "100%",
        height: "auto",
      }}
    />
    <h5
      className={`
        mx-4 text-center text-xl ${loading && "opacity-0"} 
        font-bold transition-opacity duration-200
      `}
    >
      {text}
    </h5>
  </div>
)

export default EmptyPlaceholder
