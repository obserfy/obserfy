import React, { FC, useState } from "react"
import Img from "react-optimized-image"
import ProfilePicture from "./profilePicture"
import Button from "./Button/Button"
import LogoutIcon from "../icons/log-out.svg"
import Logo from "../images/logo.svg"

interface Props {
  userName?: string
  userImageSrc?: string
}
const Header: FC<Props> = ({ userImageSrc, userName }) => {
  const [showLogout, setShowLogout] = useState(false)

  return (
    <>
      <div className="bg-surface">
        <div className="p-3 pb-2 flex items-center max-w-3xl mx-auto">
          <Img alt="obserfy logo" src={Logo} height={30} width={30} />
          <div className="ml-4">
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
            <Img alt="logout icon" src={LogoutIcon} height={18} width={18} />
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
