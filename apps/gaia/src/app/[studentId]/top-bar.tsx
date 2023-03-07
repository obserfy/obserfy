import StudentSelector from "$components/StudentSelector"
import { getUser } from "$lib/auth-ssr"
import { getGuardianStudents, getStudentsById } from "$lib/student"
import UserOptions from "./user-options"

interface Props {
  studentId: string
}

export default async function TopBar({ studentId }: Props) {
  const user = await getUser()
  const students = await getGuardianStudents(user?.email)
  const student = await getStudentsById(studentId)

  return (
    <div className="relative z-20 h-16 bg-surface/90  backdrop-blur-lg sm:sticky sm:top-0 sm:border-b">
      <div className="flex h-16 items-center px-4 sm:pl-0">
        <div className="mr-4 hidden w-sidebar shrink-0 border-r px-4 font-bold text-gray-600 sm:block">
          {student?.schools?.name}
        </div>

        {students && student && (
          <StudentSelector
            students={students.map((s) => {
              return {
                id: s.id,
                name: s.name,
                profilePic: s.profilePic,
              }
            })}
            selectedStudent={{
              id: student.id,
              name: student.name,
              schoolName: student.schools?.name,
            }}
          />
        )}

        <UserOptions name={user?.name} picture={user?.picture} />
      </div>
    </div>
  )
}
