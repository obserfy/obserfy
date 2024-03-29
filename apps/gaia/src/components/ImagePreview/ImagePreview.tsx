import { Timeline } from "$api/children/[childId]/timeline"
import StudentProfile from "$components/StudentProfile"
import { FC } from "react"
import useGetChild from "../../hooks/api/useGetChild"
import useGetObservationsByImage from "../../hooks/api/useGetImageObservation"
import useBodyScrollLock from "../../hooks/useBodyScrollLock"
import Icon from "../Icon/Icon"

const ImagePreview: FC<{
  childId: string
  img: Timeline["observations"][0]["images"][0]
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
          </div>
          <button data-cy="close" className="ml-auto" onClick={onDismiss}>
            <Icon src="/icons/close.svg" className={"h-8 w-8"} />
          </button>
        </div>
        <img
          src={img.originalImageUrl}
          alt="preview"
          className="min-h-[400px] w-full bg-black object-cover"
        />
        {observations.data?.map((obv) => (
          <div key={obv.id} className="bg-white p-4">
            <p className="mb-2 font-bold">{obv.shortDesc}</p>
            <p className="font-normal">{obv.longDesc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
export default ImagePreview
