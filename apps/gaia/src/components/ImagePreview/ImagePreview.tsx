import StudentProfile from "$components/StudentProfile"
import Image from "next/image"
import { FC } from "react"
import useGetChild from "../../hooks/api/useGetChild"
import { ChildImage } from "../../hooks/api/useGetChildImages"
import useGetObservationsByImage from "../../hooks/api/useGetImageObservation"
import useBodyScrollLock from "../../hooks/useBodyScrollLock"
import dayjs from "$lib/dayjs"
import Icon from "../Icon/Icon"

const ImagePreview: FC<{
  childId: string
  img: ChildImage
  onDismiss: () => void
}> = ({ img, onDismiss, childId }) => {
  const ref = useBodyScrollLock()
  const child = useGetChild(childId)
  const observations = useGetObservationsByImage(img.id)

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
    <div
      ref={ref}
      className="scrolling-touch fixed inset-0 z-50 flex h-screen w-screen justify-center overflow-y-auto bg-overlay md:items-center"
      onClick={onDismiss}
    >
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-noninteractive-element-interactions,jsx-a11y/no-static-element-interactions */}

      <div
        className="
          max-h-screen
          w-full
          max-w-2xl
          bg-white
        "
        onClick={(e) => e.stopPropagation()}
        style={{ minHeight: 300 }}
      >
        <div className="flex items-center p-3">
          <StudentProfile
            src={child.data?.profilePic}
            width={32}
            height={32}
            className="rounded-full"
          />
          <div>
            <div className="ml-3 font-bold">{child.data?.name}</div>
            <div className="ml-3 text-xs opacity-75">
              {dayjs(img.createdAt).format("dddd, DD MMM YYYY")}
            </div>
          </div>
          <button data-cy="close" className="ml-auto" onClick={onDismiss}>
            <Icon src="/icons/close.svg" className={"h-8 w-8"} />
          </button>
        </div>
        <img
          src={img.originalImageUrl}
          alt="preview"
          className="w-full object-cover"
        />
        {observations.data?.map((obv) => (
          <div key={obv.id} className="bg-white p-4">
            <div className="font-bold">{obv.shortDesc}</div>
            <div className="font-normal">{obv.longDesc}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
export default ImagePreview
