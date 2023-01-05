import Image from "next/image"
import { FC } from "react"
import Placeholder from "$public/images/student-profile-placeholder.jpg"

const StudentProfile: FC<{
  src?: string | null
  className?: string
  width: number
  height: number
}> = ({ src, className, width, height }) => {
  if (src) {
    return (
      <div className="flex shrink-0">
        <Image
          src={src}
          className={className}
          width={width}
          height={height}
          objectFit="cover"
          alt=""
        />
      </div>
    )
  }

  return (
    <div className="flex shrink-0">
      <Image
        src={Placeholder}
        objectFit="cover"
        placeholder={width > 40 ? "blur" : "empty"}
        className={className}
        width={width}
        height={height}
        alt=""
      />
    </div>
  )
}

export default StudentProfile
