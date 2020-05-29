import React, { FC, useState } from "react"
import ProfilePicture from "./profilePicture"
import Button from "./button"
import useGetChild from "../hooks/useGetChild"
import { useQueryString } from "../hooks/useQueryString"
import LogoutIcon from "../icons/log-out.svg"
import StudentPicPlaceholder from "../images/student_pic_placeholder.jpg"

interface Props {
  userName?: string
  userImageSrc?: string
}
const Header: FC<Props> = ({ userImageSrc, userName }) => {
  const childId = useQueryString("childId")
  const [showLogout, setShowLogout] = useState(false)
  const child = useGetChild(childId)

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
          <div className="ml-6">
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
        <div className="flex px-3 py-6 max-w-4xl mx-auto">
          <div>
            <img
              alt="profile"
              src={child.data?.profilePic ?? StudentPicPlaceholder}
              width={60}
              height={60}
              className="rounded-full"
            />
          </div>
          <div>
            <div className="ml-3 text-2xl leading-tight">
              {child.data?.name}
            </div>
            <div className="ml-3 text-sm text-gray-700">
              {child.data?.schoolName}
            </div>
          </div>
        </div>
      </div>
      <div className="sticky top-0 bg-surface border-b ">
        <nav className="w-full flex max-w-4xl mx-auto">
          <div
            className="mx-3 px-1 py-2 border-b-2 border-black text-sm"
            style={{ marginBottom: "-1px" }}
          >
            Lesson Plans
          </div>
        </nav>
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
