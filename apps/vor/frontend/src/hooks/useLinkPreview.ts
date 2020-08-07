import { useQuery } from "react-query"

const useLinkPreview = (link: string) => {
  const getLinkMetadata = async () => {
    const result = await fetch(link)
    console.log(result.body)
    return result.body
  }

  return useQuery([link], getLinkMetadata)
}

export default useLinkPreview
