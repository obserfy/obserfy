import React, { FC, useState } from "react"
import Img from "react-optimized-image"
import ProfilePicture from "./profilePicture"
import Button from "./Button/Button"
import LogoutIcon from "../icons/log-out.svg"
import Logo from "../images/logo.svg"
import useGetUser from "../hooks/api/useGetUser"

const Header: FC = () => {
  const [showLogout, setShowLogout] = useState(false)
  const user = useGetUser()

  if (user.isLoading) {
    return <LoadingPlaceholder />
  }

  if (user.isError) {
    return <ErrorPlaceholder />
  }

  return (
    <>
      <div className="px-3 flex items-center max-w-3xl mx-auto h-16">
        <ProfilePicture className="" src={user.data.picture} />
        <div className="ml-2 text-sm font-bold">{user.data.name}</div>
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

const LoadingPlaceholder = () => (
  <div className="h-16 px-3 flex items-center max-w-3xl mx-auto">
    <div
      className="rounded-full bg-gray-200"
      style={{ width: 30, height: 30 }}
    />
    <div className="bg-gray-200 w-16 h-4 rounded ml-3" />
  </div>
)

const ErrorPlaceholder = () => (
  <div className="h-16 px-3 flex items-center max-w-3xl mx-auto">
    <Img alt="obserfy logo" src={Logo} height={30} width={30} />
    <h1 className="ml-3 text-lg font-bold">
      Obserfy <span className="font-normal">for Parents</span>
    </h1>
  </div>
)

export default Header
