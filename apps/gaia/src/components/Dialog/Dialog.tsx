import { FC } from "react"

const Dialog: FC = ({ children }) => {
  return (
    <div className="flex fixed top-0 left-0 z-50 justify-center items-center w-screen h-screen bg-overlay">
      <div className="flex flex-col items-center p-3 bg-white rounded shadow-md">
        {children}
      </div>
    </div>
  )
}

export default Dialog
