import { useQuery } from "react-query"

const useLinkPreview = (link: string) => {
  const getLinkMetadata = async () => {
    const result = await fetch(link)
    return result.body
  }

  return useQuery([link], getLinkMetadata)
}

export default useLinkPreview
