import React, { FC } from "react"
import ProfilePicture from "./profilePicture"

interface Props {
  userName?: string
  userImageSrc?: string
}
const Header: FC<Props> = ({ userImageSrc, userName }) => (
  <>
    <div className="bg-surface">
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
        <img
          alt="menu"
          src={require("../icons/menu.svg")}
          className="ml-auto mr-3"
        />
      </div>
      <div className="flex px-3 py-6 max-w-6xl mx-auto">
        <div>
          <img
            alt="profile"
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT4LlsiK4wcMEo2fEGLfj3WNBxAIXZJSnMgSlZavkf2HZGcWzhXDyvxfZOSrJ8&s"
            width={60}
            height={60}
            className="rounded-full"
          />
        </div>
        <div>
          <div className="ml-3 text-2xl">Hermione Granger</div>
          <div className="ml-3 text-sm text-gray-700">Joyful Online</div>
        </div>
      </div>
    </div>
    <div className="sticky top-0 bg-surface border-b ">
      <nav className="w-full flex max-w-6xl mx-auto">
        <div
          className="mx-3 px-1 py-2 border-b-2 border-black text-sm"
          style={{ marginBottom: "-1px" }}
        >
          Lesson Plans
        </div>
      </nav>
    </div>
  </>
)

export default Header
