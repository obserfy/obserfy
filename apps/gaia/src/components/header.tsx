import React, { FC, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import ProfilePicture from "./profilePicture"
import Button from "./Button/Button"
import useGetUser from "../hooks/api/useGetUser"
import useGetChildren from "../hooks/api/useGetChildren"
import { useQueryString } from "../hooks/useQueryString"
import Icon from "./Icon/Icon"

const Header: FC = () => {
  const [showLogout, setShowLogout] = useState(false)
  const [showChildPicker, setShowChildPicker] = useState(false)
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
        <ProfilePicture src={user.data?.picture ?? ""} />
        <div className="ml-2 text-sm font-bold">{user.data?.name}</div>
        <Button
          outline
          className="ml-auto p-2 cursor-pointer hover:bg-gray-200"
          onClick={() => setShowChildPicker(true)}
        >
          <Icon alt="logout icon" src="/icons/users.svg" />
        </Button>

        <Button
          outline
          className="ml-3 p-2 cursor-pointer hover:bg-gray-200"
          onClick={() => setShowLogout(true)}
        >
          <Icon alt="logout icon" src="/icons/log-out.svg" />
        </Button>
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
                <Button
                  className="w-full bg-red-700 text-white"
                  onClick={() => mixpanel.reset()}
                >
                  Yes
                </Button>
              </a>
            </div>
          </div>
        </div>
      )}

      {showChildPicker && (
        <ChildPicker onClose={() => setShowChildPicker(false)} />
      )}
    </>
  )
}

const ChildPicker: FC<{ onClose: () => void }> = ({ onClose }) => {
  const childId = useQueryString("childId")
  const { data: children } = useGetChildren()

  return (
    <div className="fixed h-screen w-screen bg-overlay z-50 top-0 left-0 flex items-center justify-center">
      <div className="bg-white rounded shadow-md mx-3 overflow-hidden">
        <div className="flex items-end py-3">
          <div className="text-xl font-bold px-6">Switch</div>

          <Button outline onClick={onClose} className="p-1 ml-auto mr-3">
            <Icon src="/icons/close.svg" size={20} />
          </Button>
        </div>
        {children?.map(({ id, name }) => (
          <Link href={`/?childId=${id}`} key={id}>
            {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
            <a
              className={`flex items-center leading-tight ${
                id === childId
                  ? "border-l-4 border-green-700 text-green-800"
                  : ""
              } `}
              onClick={onClose}
            >
              <div
                className={`text-lg py-4 px-6 ${
                  id === childId ? "font-bold" : ""
                }`}
              >
                {name}
              </div>
              <Icon
                src="/icons/chevron-right.svg"
                className="ml-auto w-6 h-6 mr-4 opacity-50"
              />
            </a>
          </Link>
        ))}
      </div>
    </div>
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
    <Image alt="obserfy logo" src="/images/logo.svg" height={30} width={30} />
    <h1 className="ml-3 text-lg font-bold">
      Obserfy <span className="font-normal">for Parents</span>
    </h1>
  </div>
)

export default Header
