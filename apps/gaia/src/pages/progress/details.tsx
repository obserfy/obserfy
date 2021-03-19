import Link from "next/link"
import React, { FC } from "react"
import { useQueryString } from "../../hooks/useQueryString"
import BackIcon from "../../icons/arrow-back.svg"

const Details: FC = () => {
  const childId = useQueryString("childId")
  const materialId = useQueryString("materialId")

  return (
    <div>
      <div className="w-full max-w-3xl mx-auto flex px-1 items-center">
        <Link href={`/progress?childId=${childId}`}>
          <button className="m-1 hover:text-green-700">
            <BackIcon className="w-4 h-4 m-2" />
          </button>
        </Link>
        <Link href={`/progress?childId=${childId}`}>
          <a className="text-xs">Progress</a>
        </Link>
        <div className="mx-3">/</div>
        <div className="text-xs text-green-700">Details</div>
      </div>
    </div>
  )
}

export default Details
