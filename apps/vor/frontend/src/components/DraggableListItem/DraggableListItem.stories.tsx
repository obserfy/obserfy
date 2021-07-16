import { FC, Fragment } from "react"
import { borderBottom, borderRight } from "../../border"
import { useMoveDraggableItem } from "../../hooks/useMoveDraggableItem"
import DraggableListItem from "./DraggableListItem"

export default {
  title: "Core/DraggableListItem",
  component: DraggableListItem,
  parameters: {
    componentSubtitle: "Just a simple DraggableListItem",
  },
}

export const Basic: FC = () => {
  const [items, moveItem] = useMoveDraggableItem([
    { order: 0, id: "asdf" },
    { order: 1, id: "asjfda" },
    { order: 2, id: "ajrhgflkjenbrgk" },
  ])

  return (
    <Fragment>
      {items.map((item) => (
        <DraggableListItem
          key={item.id}
          item={item}
          moveItem={moveItem}
          height={54}
          containerSx={{
            ...borderBottom,
            ...borderRight,
            borderRightColor: "textPrimary",
            borderRightWidth: 2,
            alignItems: "center",
            "&:hover": {
              backgroundColor: "primaryLightest",
            },
          }}
        >
          {item.id}
        </DraggableListItem>
      ))}
    </Fragment>
  )
}
