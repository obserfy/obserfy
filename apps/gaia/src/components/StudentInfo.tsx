import Image from "next/image"
import { FC } from "react"
import useGetChild from "$hooks/api/useGetChild"

interface Props {
  studentId: string
}
const StudentInfo: FC<Props> = ({ studentId }) => {
  const child = useGetChild(studentId)

  return child.status === "success" ? (
    <>
      <div className="flex items-center py-3 px-3 mx-auto max-w-3xl">
        <div className="flex-shrink-0">
          {child.data?.profilePic ? (
            <Image
              alt="profile"
              src={child.data.profilePic}
              width={60}
              height={60}
              className="object-cover rounded-full"
            />
          ) : (
            <Image
              alt="profile"
              src="/images/student_pic_placeholder.jpg"
              width={60}
              height={60}
              className="rounded-full"
            />
          )}
        </div>
        <div className="ml-4">
          <div className="mb-1 text-xl font-bold leading-tight">
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
  <div className="flex items-center py-2 px-3 mx-auto max-w-3xl bg-white">
    <div
      className="my-1 rounded-full loading-placeholder"
      style={{
        width: 60,
        height: 60,
      }}
    />
    <div>
      <div className="my-2 ml-4 w-32 h-6 text-2xl leading-tight rounded loading-placeholder" />
      <div className="my-2 ml-4 w-24 h-4 text-sm text-gray-700 rounded loading-placeholder" />
    </div>
  </div>
)

export default StudentInfo
