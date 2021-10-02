import Image from "next/image"
import Link from "next/link"
import { FC, useState } from "react"
import useGetChildren from "../hooks/api/useGetChildren"
import useGetUser from "../hooks/api/useGetUser"
import { useQueryString } from "../hooks/useQueryString"
import Button from "./Button/Button"
import Icon from "./Icon/Icon"
import ProfilePicture from "./profilePicture"

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
      <div className="flex items-center px-3 mx-auto max-w-3xl h-16">
        <ProfilePicture src={user.data?.picture ?? ""} />
        <div className="ml-2 text-sm font-bold">{user.data?.name}</div>
        <Button
          outline
          className="p-2 ml-auto hover:bg-gray-200 cursor-pointer"
          onClick={() => setShowChildPicker(true)}
        >
          <Icon src="/icons/users.svg" />
        </Button>

        <Button
          outline
          className="p-2 ml-3 hover:bg-gray-200 cursor-pointer"
          onClick={() => setShowLogout(true)}
        >
          <Icon src="/icons/log-out.svg" />
        </Button>
      </div>

      {showLogout && (
        <div className="flex fixed top-0 left-0 z-50 justify-center items-center w-screen h-screen bg-overlay">
          <div className="flex flex-col items-center p-3 bg-white rounded shadow-md">
            <div className="mx-6 mt-3 mb-6 text-xl">Do you want to logout?</div>
            <div className="flex w-full">
              <Button outline onClick={() => setShowLogout(false)}>
                Cancel
              </Button>
              <a href="/api/auth/logout" className="block ml-3 w-full">
                <Button
                  className="w-full text-white bg-red-700"
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
    <div className="flex fixed top-0 left-0 z-50 justify-center items-center w-screen h-screen bg-overlay">
      <div className="overflow-hidden mx-3 bg-white rounded shadow-md">
        <div className="flex items-end py-3">
          <div className="px-6 text-xl font-bold">Switch</div>

          <Button outline onClick={onClose} className="p-1 mr-3 ml-auto">
            <Icon src="/icons/close.svg" />
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
                className="mr-4 ml-auto w-6 h-6 opacity-50"
              />
            </a>
          </Link>
        ))}
      </div>
    </div>
  )
}

const LoadingPlaceholder = () => (
  <div className="flex items-center px-3 mx-auto max-w-3xl h-16">
    <div
      className="bg-gray-200 rounded-full"
      style={{ width: 30, height: 30 }}
    />
    <div className="ml-3 w-16 h-4 bg-gray-200 rounded" />
  </div>
)

const ErrorPlaceholder = () => (
  <div className="flex items-center px-3 mx-auto max-w-3xl h-16">
    <Image alt="obserfy logo" src="/images/logo.svg" height={30} width={30} />
    <h1 className="ml-3 text-lg font-bold">
      Obserfy <span className="font-normal">for Parents</span>
    </h1>
  </div>
)

export default Header
