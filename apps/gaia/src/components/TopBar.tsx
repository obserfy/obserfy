import { useRouter } from "next/router"
import StudentSelector from "$components/StudentSelector"
import useGetChild from "$hooks/api/useGetChild"
import useGetChildren from "$hooks/api/useGetChildren"
import useGetUser from "$hooks/api/useGetUser"
import { useQueryString } from "$hooks/useQueryString"

/* This example requires Tailwind CSS v2.0+ */

const TopBar = () => {
  const router = useRouter()
  const studentId = useQueryString("studentId")
  const { data: student } = useGetChild(studentId)
  const { data: user } = useGetUser()
  const { data: students } = useGetChildren()

  const selectedStudent = students?.find(({ id }) => id === studentId)

  return (
    <div className="sm:sticky sm:top-0 z-10 h-16 bg-surface sm:border-b">
      <div className="flex items-center px-4 sm:pl-0 h-16">
        <div className="hidden sm:block flex-shrink-0 px-4 mr-4 w-sidebar font-bold text-gray-600 border-r">
          {student?.schoolName}
        </div>

        {students && student && (
          <StudentSelector
            students={students}
            selectedStudent={selectedStudent}
            setSelectedStudent={(s) => {
              router.push(router.asPath.replace(student.id, s.id))
            }}
          />
        )}

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
