import React, { FC } from "react"
import Img from "react-optimized-image/lib"
import Image from "next/image"
import StudentPicPlaceholder from "../../images/student_pic_placeholder.jpg"
import useGetChild from "../../hooks/api/useGetChild"

interface Props {
  childId: string
}
const ChildInfo: FC<Props> = ({ childId }) => {
  const child = useGetChild(childId)

  return child.status === "success" ? (
    <>
      <div className="flex px-3 py-3 max-w-3xl mx-auto items-center">
        <div className="flex-shrink-0">
          {child.data?.profilePic ? (
            <Image
              alt="profile"
              src={child.data.profilePic}
              width={60}
              height={60}
              className="rounded-full object-cover"
            />
          ) : (
            <Img
              alt="profile"
              src={StudentPicPlaceholder}
              width={60}
              height={60}
              className="rounded-full"
            />
          )}
        </div>
        <div className="ml-4">
          <div className="text-xl leading-tight font-bold mb-1">
            {child.data?.name}
          </div>
          <div className="text-sm text-gray-700">{child.data?.schoolName}</div>
        </div>
      </div>
    </>
  ) : (
    <LoadingPlaceholder />
  )
}

const LoadingPlaceholder = () => (
  <div className="bg-white flex px-3 py-2 max-w-3xl mx-auto items-center">
    <div
      className="rounded-full loading-placeholder my-1"
      style={{
        width: 60,
        height: 60,
      }}
    />
    <div>
      <div className="loading-placeholder ml-4 text-2xl leading-tight my-2 w-32 h-6 rounded" />
      <div className="loading-placeholder ml-4 text-sm text-gray-700 my-2 w-24 h-4 rounded" />
    </div>
  </div>
)

export default ChildInfo
