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
      <div className="flex aspect-1 shrink-0">
        <Image
          src={src}
          className={className}
          width={width}
          height={height}
          alt=""
          style={{
            maxWidth: "100%",
            height: "auto",
            objectFit: "cover",
          }}
        />
      </div>
    )
  }

  return (
    <div className="flex aspect-1 shrink-0">
      <Image
        src={Placeholder}
        placeholder={width > 40 ? "blur" : "empty"}
        className={className}
        width={width}
        height={height}
        alt=""
        style={{
          maxWidth: "100%",
          height: "auto",
          objectFit: "cover",
        }}
      />
    </div>
  )
}

export default StudentProfile
