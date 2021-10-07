/* This example requires Tailwind CSS v2.0+ */
import { Dialog, Transition } from "@headlessui/react"
import clsx from "clsx"
import { FC, Fragment, ReactNode, useRef } from "react"
import Button from "$components/Button/Button"

const AlertDialog: FC<{
  isOpen: boolean
  close: () => void
  title: string
  description?: string
  icon: ReactNode
  actionButton: ReactNode
}> = ({ isOpen, close, title, description, icon, actionButton }) => {
  const cancelButtonRef = useRef(null)

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="overflow-y-auto fixed inset-0 z-10"
        initialFocus={cancelButtonRef}
        onClose={close}
      >
        <div className="flex sm:block justify-center items-end sm:p-0 px-4 pt-4 pb-20 min-h-screen text-center">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="hidden sm:inline-block sm:h-screen sm:align-middle"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="inline-block overflow-hidden sm:my-8 sm:w-full sm:max-w-lg text-left align-bottom sm:align-middle bg-white rounded-lg shadow-xl transition-all transform">
              <div className="sm:p-6 px-4 pt-5 pb-4 sm:pb-4 bg-white">
                <div
                  className={clsx(
                    "sm:flex ",
                    description ? "sm:items-start" : "sm:items-center"
                  )}
                >
                  {icon}
                  <div className="mt-3 sm:mt-0 sm:ml-4 text-center sm:text-left">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-semibold leading-6 text-gray-900"
                    >
                      {title}
                    </Dialog.Title>
                    {description && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">{description}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="sm:flex sm:flex-row-reverse py-3 px-4 sm:px-6 bg-gray-50">
                {actionButton}
                <Button
                  variant="outline"
                  className="mt-3 sm:mt-0 sm:ml-3 w-full sm:w-auto text-base sm:text-sm text-gray-700"
                  onClick={close}
                  ref={cancelButtonRef}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  )
}

export default AlertDialog
