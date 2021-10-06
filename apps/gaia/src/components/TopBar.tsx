import Image from "next/image"
import useGetChildren from "$hooks/api/useGetChildren"
import Icon from "$components/Icon/Icon"
import useGetChild from "$hooks/api/useGetChild"
import useGetUser from "$hooks/api/useGetUser"
import { useQueryString } from "$hooks/useQueryString"

const TopBar = () => {
  const studentId = useQueryString("studentId")
  const { data: student } = useGetChild(studentId)
  const { data: user } = useGetUser()
  const { data: students } = useGetChildren()

  return (
    <div className="sm:sticky sm:top-0 z-10 h-16 bg-surface sm:border-b">
      <div className="flex items-center px-4 sm:pl-0 h-16">
        <div className="hidden sm:block px-4 mr-4 w-sidebar font-bold text-gray-600 border-r">
          {student?.schoolName}
        </div>

        <div className="flex-shrink-0">
          {student?.profilePic && (
            <Image
              src={student?.profilePic}
              width={32}
              height={32}
              objectFit="cover"
              className="rounded-full"
            />
          )}
        </div>

        <div className="ml-3">
          <p className="flex items-center mr-8 font-semibold leading-tight text-gray-900">
            {student?.name}
            <Icon
              src="/icons/chevron-down.svg"
              className="flex-shrink-0 ml-2 opacity-70"
            />
          </p>
        </div>

        <div className="flex flex-shrink-0 items-center ml-auto">
          <img
            alt="profile"
            src={user?.picture}
            width={32}
            height={32}
            className="rounded-full"
          />

          <p className="hidden md:block ml-2 text-sm font-semibold text-gray-700">
            {user?.name}
          </p>
        </div>
      </div>
    </div>
  )
}

export default TopBar
