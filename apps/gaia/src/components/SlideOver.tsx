import { Dialog, Transition } from "@headlessui/react"
import clsx from "clsx"
import { FC, Fragment } from "react"
import Button from "$components/Button/Button"
import Icon from "$components/Icon/Icon"

const SlideOver: FC<{
  show: boolean
  onClose: () => void
  title: string
  className?: string
}> = ({ show, onClose, children, title, className }) => (
  <Transition.Root show={show} as={Fragment}>
    <Dialog
      as="div"
      className={clsx("overflow-hidden fixed inset-0 z-20", className)}
      onClose={onClose}
    >
      <div className="overflow-hidden absolute inset-0">
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Dialog.Overlay className="absolute inset-0 bg-gray-900 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="flex fixed inset-y-0 right-0 pl-10 max-w-full">
          <Transition.Child
            as={Fragment}
            enter="transform transition ease-in-out duration-500 sm:duration-700"
            enterFrom="translate-x-full"
            enterTo="translate-x-0"
            leave="transform transition ease-in-out duration-500 sm:duration-700"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-full"
          >
            <div className="w-screen max-w-md border-t">
              <div className="flex overflow-y-scroll flex-col pt-6 h-full bg-white shadow-xl">
                <div className="px-4 sm:px-6 mb-4">
                  <div className="flex justify-between items-start">
                    <Dialog.Title className="text-lg font-medium text-gray-900">
                      {title}
                    </Dialog.Title>
                    <div className="flex items-center ml-3 h-7">
                      <Button variant="icon" onClick={onClose}>
                        <span className="sr-only">Close panel</span>
                        <Icon src="/icons/close.svg" aria-hidden="true" />
                      </Button>
                    </div>
                  </div>
                </div>

                {children}
              </div>
            </div>
          </Transition.Child>
        </div>
      </div>
    </Dialog>
  </Transition.Root>
)

export default SlideOver
