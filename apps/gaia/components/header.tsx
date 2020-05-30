import React, { FC, useState } from "react"
import ProfilePicture from "./profilePicture"
import Button from "./button"
import LogoutIcon from "../icons/log-out.svg"

interface Props {
  userName?: string
  userImageSrc?: string
}
const Header: FC<Props> = ({ userImageSrc, userName }) => {
  const [showLogout, setShowLogout] = useState(false)

  return (
    <>
      <div className="bg-surface">
        <div className="p-3 pb-2 flex items-center max-w-4xl mx-auto">
          <img
            alt="obserfy logo"
            src="/logo-transparent.png"
            height={40}
            width={40}
          />
          <div className="ml-8">
            <ProfilePicture src={userImageSrc} />
          </div>
          <div className="ml-3 text-sm">{userName}</div>
          <div
            tabIndex={0}
            role="button"
            className="ml-auto p-3 cursor-pointer"
            onClick={() => setShowLogout(true)}
            onKeyUp={(e) => e.keyCode === 13 && setShowLogout(true)}
          >
            <img alt="logout icon" src={LogoutIcon} height={18} width={18} />
          </div>
        </div>
      </div>

      {showLogout && (
        <div className="fixed h-screen w-screen bg-overlay z-50 top-0 left-0 flex items-center justify-center">
          <div className="bg-white rounded shadow-md p-3 flex flex-col items-center">
            <div className="text-xl mx-6 mb-6 mt-3">Do you want to logout?</div>
            <div className="flex w-full">
              <Button outline onClick={() => setShowLogout(false)}>
                Cancel
              </Button>
              <a href="/api/logout" className="block ml-3 w-full">
                <Button className="w-full bg-red-700 text-white">Yes</Button>
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Header
