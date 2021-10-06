import { Listbox, Transition } from "@headlessui/react"
import clsx from "clsx"
import Image from "next/image"
import { FC, Fragment } from "react"
import Icon from "$components/Icon/Icon"
import useGetChild from "$hooks/api/useGetChild"
import useGetChildren from "$hooks/api/useGetChildren"
import useGetUser from "$hooks/api/useGetUser"
import { useQueryString } from "$hooks/useQueryString"

/* This example requires Tailwind CSS v2.0+ */

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

        <div className="flex items-center">
          <div className={"flex flex-shrink-0"}>
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
                className="flex-shrink-0 ml-1 opacity-70 !w-6 !h-6"
              />
            </p>
          </div>
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

const StudentSelector: FC<{
  students: Array<{ id: string; name: string; profilePic: string }>
  selectedStudent: { id: string; name: string; profilePic: string }
  setSelectedStudent: (student: {
    id: string
    name: string
    profilePic: string
  }) => void
}> = ({ students, selectedStudent, setSelectedStudent }) => (
  <Listbox value={selectedStudent} onChange={setSelectedStudent}>
    <Listbox.Label className="block text-sm font-medium text-gray-700">
      Assigned to
    </Listbox.Label>
    <div className="relative mt-1">
      <Listbox.Button className="relative py-2 pr-10 pl-3 w-full sm:text-sm text-left bg-white rounded-md border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 shadow-sm cursor-default focus:outline-none">
        <span className="flex items-center">
          <img
            src={selectedStudent.profilePic}
            alt=""
            className="flex-shrink-0 w-6 h-6 rounded-full"
          />
          <span className="block ml-3 truncate">{selectedStudent.name}</span>
        </span>
        {/* <span className="flex absolute inset-y-0 right-0 items-center pr-2 ml-3 pointer-events-none"> */}
        {/* <SelectorIcon className="w-5 h-5 text-gray-400" aria-hidden="true" /> */}
        {/* </span> */}
      </Listbox.Button>

      <Transition
        as={Fragment}
        leave="transition ease-in duration-100"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <Listbox.Options className="overflow-auto absolute z-10 py-1 mt-1 w-full max-h-56 text-base sm:text-sm bg-white rounded-md ring-1 ring-black ring-opacity-5 shadow-lg focus:outline-none">
          {students.map((person) => (
            <Listbox.Option
              key={person.id}
              className={({ active }) =>
                clsx(
                  active ? "text-white bg-indigo-600" : "text-gray-900",
                  "relative py-2 pr-9 pl-3 cursor-default select-none"
                )
              }
              value={person}
            >
              {({ selected, active }) => (
                <>
                  <div className="flex items-center">
                    <img
                      src={person.profilePic}
                      alt=""
                      className="flex-shrink-0 w-6 h-6 rounded-full"
                    />
                    <span
                      className={clsx(
                        selected ? "font-semibold" : "font-normal",
                        "block ml-3 truncate"
                      )}
                    >
                      {person.name}
                    </span>
                  </div>

                  {selected ? (
                    <span
                      className={clsx(
                        active ? "text-white" : "text-indigo-600",
                        "flex absolute inset-y-0 right-0 items-center pr-4"
                      )}
                    >
                      <Icon src="/icons/check.svg" aria-hidden="true" />
                    </span>
                  ) : null}
                </>
              )}
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </Transition>
    </div>
  </Listbox>
)

export default TopBar
