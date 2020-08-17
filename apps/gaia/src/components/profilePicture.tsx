import React, { FC } from "react"

interface Props {
  src: string
  className?: string
}
const ProfilePicture: FC<Props> = ({ className = "", src }) => (
  <img
    alt="profile"
    src={src}
    width={30}
    height={30}
    className={`rounded-full ${className}`}
  />
)

export default ProfilePicture
