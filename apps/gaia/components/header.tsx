import React, { FC } from "react"
import ProfilePicture from "./profilePicture"

interface Props {
  userName?: string
  userImageSrc?: string
}
const Header: FC<Props> = ({ userImageSrc, userName }) => (
  <div className="bg-surface border-b ">
    <div className="p-3 pb-2 flex items-center max-w-6xl mx-auto">
      <img
        alt="obserfy logo"
        src="/logo-transparent.png"
        height={40}
        width={40}
      />
      <div className="ml-6">
        <ProfilePicture src={userImageSrc} />
      </div>
      <div className="ml-3 text-sm">{userName}</div>
    </div>
    <div className="w-full flex max-w-6xl mx-auto sticky">
      <div className="mx-3 px-1 py-2 border-b-2 border-black text-sm">
        Lesson Plans
      </div>
    </div>
  </div>
)

export default Header
