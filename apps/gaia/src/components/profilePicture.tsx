import React, { FC } from "react"

interface Props {
  src: string
}
const ProfilePicture: FC<Props> = ({ src }) => (
  <img alt="profile" src={src} width={30} height={30} className="rounded" />
)

export default ProfilePicture
