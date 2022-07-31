import { FC } from "react"

const Dialog: FC = ({ children }) => {
  return (
    <div className="fixed top-0 left-0 z-50 flex h-screen w-screen items-center justify-center bg-overlay">
      <div className="flex flex-col items-center rounded bg-white p-3 shadow-md">
        {children}
      </div>
    </div>
  )
}

export default Dialog
