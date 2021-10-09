import { Listbox, Transition } from "@headlessui/react"
import clsx from "clsx"
import { FC, Fragment } from "react"
import StudentProfile from "$components/StudentProfile"
import Icon from "$components/Icon/Icon"

interface Student {
  id: string
  name: string
  profilePic: string
  schoolName?: string
}

const StudentSelector: FC<{
  students: Array<Student>
  selectedStudent?: Student
  setSelectedStudent: (student: Student) => void
}> = ({ students, selectedStudent, setSelectedStudent }) => (
  <Listbox value={selectedStudent} onChange={setSelectedStudent}>
    <Listbox.Label className="sr-only">Select Student</Listbox.Label>
    <div className="relative">
      <SelectedStudent student={selectedStudent} />

      <Transition
        as={Fragment}
        leave="transition ease-in duration-100"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <Listbox.Options className="overflow-auto absolute z-10 py-1 mt-1 w-full max-h-56 text-base sm:text-sm bg-white rounded-md ring-1 ring-black ring-opacity-5 shadow-lg focus:outline-none">
          {students.map((student) => (
            <Option key={student.id} {...student} />
          ))}
        </Listbox.Options>
      </Transition>
    </div>
  </Listbox>
)

const SelectedStudent: FC<{ student?: Student }> = ({ student }) => (
  <Listbox.Button className="flex items-center p-0.5 mr-4 sm:text-sm text-left rounded-full focus:border-primary-500 focus:ring-1 focus:ring-primary-500 cursor-pointer focus:outline-none">
    <StudentProfile
      src={student?.profilePic}
      width={32}
      height={32}
      className="rounded-full"
    />
    <div>
      <p className="ml-3 text-sm font-semibold leading-tight text-gray-900 truncate max-w-[140px] md:max-w-[200px]">
        {student?.name}
      </p>
      <p className="sm:hidden ml-3 text-xs leading-tight text-gray-600 truncate max-w-[140px] md:max-w-[200px]">
        {student?.schoolName}
      </p>
    </div>
    <Icon
      src="/icons/chevron-down.svg"
      className="flex-shrink-0 ml-2 opacity-70 !w-6 !h-6"
    />
  </Listbox.Button>
)

const Option: FC<Student> = (student) => (
  <Listbox.Option
    className={({ active }) =>
      clsx(
        active ? "text-white bg-primary-600" : "text-gray-900",
        "relative py-2 pr-9 pl-3 cursor-pointer select-none"
      )
    }
    value={student}
  >
    {({ selected, active }) => (
      <>
        <div className="flex items-center">
          <StudentProfile
            src={student.profilePic}
            className="rounded-full"
            width={20}
            height={20}
          />
          <span
            className={clsx(
              selected ? "font-semibold" : "font-normal",
              "block ml-3 truncate"
            )}
          >
            {student.name}
          </span>
        </div>

        {selected ? (
          <span
            className={clsx(
              active ? "text-white" : "text-primary-600",
              "flex absolute inset-y-0 right-0 items-center pr-4"
            )}
          >
            <Icon src="/icons/check.svg" aria-hidden="true" />
          </span>
        ) : null}
      </>
    )}
  </Listbox.Option>
)

export default StudentSelector
