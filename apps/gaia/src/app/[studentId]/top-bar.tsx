import StudentSelector from "$components/StudentSelector"
import { getUser } from "$lib/auth-ssr"
import { findRelatedStudents, findStudentByStudentId } from "$lib/db"
import UserOptions from "./user-options"

interface Props {
  studentId: string
}

export default async function TopBar({ studentId }: Props) {
  const user = await getUser()
  const students = await findRelatedStudents(user?.email)
  const student = await findStudentByStudentId(studentId)

  return (
    <div className="relative z-20 h-16 bg-surface/90  backdrop-blur-lg sm:sticky sm:top-0 sm:border-b">
      <div className="flex h-16 items-center px-4 sm:pl-0">
        <div className="mr-4 hidden w-sidebar shrink-0 border-r px-4 font-bold text-gray-600 sm:block">
          {/*{student?.schoolName}*/}
        </div>

        {students && student && (
          <StudentSelector students={students} selectedStudent={student} />
        )}

        <UserOptions name={user?.name} picture={user?.picture} />
      </div>
    </div>
  )
}
