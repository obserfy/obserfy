import { Menu, Transition } from "@headlessui/react"
import { useRouter } from "next/router"
import { FC, Fragment } from "react"
import clsx from "clsx"
import Button from "$components/Button/Button"
import AlertDialog from "$components/AlertDialog"
import useToggle from "$hooks/useToggle"
import Icon from "$components/Icon/Icon"
import StudentSelector from "$components/StudentSelector"
import useGetChild from "$hooks/api/useGetChild"
import useGetChildren from "$hooks/api/useGetChildren"
import useGetUser from "$hooks/api/useGetUser"
import { useQueryString } from "$hooks/useQueryString"

const TopBar = () => {
  const router = useRouter()
  const studentId = useQueryString("studentId")
  const { data: student } = useGetChild(studentId)
  const { data: user } = useGetUser()
  const { data: students } = useGetChildren()

  return (
    <div className="relative sm:sticky sm:top-0 z-20 h-16 bg-surface bg-opacity-90 sm:border-b backdrop-filter backdrop-blur-lg">
      <div className="flex items-center px-4 sm:pl-0 h-16">
        <div className="hidden sm:block flex-shrink-0 px-4 mr-4 w-sidebar font-bold text-gray-600 border-r">
          {student?.schoolName}
        </div>

        {students && student && (
          <StudentSelector
            students={students}
            selectedStudent={student}
            setSelectedStudent={(s) => {
              router.push(router.asPath.replace(student.id, s.id))
            }}
          />
        )}

        <UserOptions name={user?.name} picture={user?.picture} />
      </div>
    </div>
  )
}

const UserOptions: FC<{
  name: string | undefined
  picture: string | undefined
}> = ({ picture, name }) => {
  const logout = useToggle()

  return (
    <>
      <LogoutAlertDialog isOpen={logout.isOn} close={logout.toggle} />
      <Menu as="div" className="inline-block relative ml-auto text-left">
        <Menu.Button className="group flex flex-shrink-0 items-center rounded-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={picture} className="w-8 h-8 rounded-full" alt="" />

          <p className="hidden md:block ml-2 text-sm font-semibold text-gray-700 group-hover:text-primary-800">
            {name}
          </p>

          <Icon
            src="/icons/chevron-down.svg"
            className="hidden sm:block !w-6 !h-6"
            color="bg-gray-800 group-hover:bg-primary-800"
          />
        </Menu.Button>

        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 mt-2 w-40 bg-white rounded-md ring-1 ring-black ring-opacity-5 shadow-lg origin-top-right focus:outline-none">
            <div className="py-1">
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={logout.toggle}
                    className={clsx(
                      active ? "text-gray-900 bg-gray-100" : "text-gray-700",
                      "group flex items-center py-2 px-4 w-full text-sm text-left"
                    )}
                  >
                    <Icon
                      src="/icons/log-out.svg"
                      className="mr-3 !w-4 !h-4"
                      color="bg-gray-700 group-hover:text-primary-700"
                    />
                    Sign out
                  </button>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </>
  )
}

const LogoutAlertDialog: FC<{
  isOpen: boolean
  close: () => void
}> = ({ close, isOpen }) => (
  <AlertDialog
    isOpen={isOpen}
    close={close}
    title="Sign Out"
    description="Do you want to sign out from Obserfy?"
    actionButton={
      // eslint-disable-next-line @next/next/no-html-link-for-pages
      <a href="/api/auth/logout">
        <Button className="sm:ml-3 w-full sm:w-auto text-base sm:text-sm hover:!bg-red-700 focus:!ring-red-500 !bg-red-600">
          Sign Out
        </Button>
      </a>
    }
    icon={
      <div className="flex flex-shrink-0 justify-center items-center mx-auto sm:mx-0 w-12 sm:w-10 h-12 sm:h-10 bg-red-100 rounded-full">
        <Icon
          src="/icons/log-out.svg"
          className="w-6 h-6"
          color="bg-red-600"
          aria-hidden="true"
        />
      </div>
    }
  />
)

export default TopBar
