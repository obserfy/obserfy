import { PageProps } from "$lib/next"

export default function Reports(props: PageProps<"reportsId">) {
  return (
    <div>
      <div>{props.params.reportsId}</div>
    </div>
  )
}
