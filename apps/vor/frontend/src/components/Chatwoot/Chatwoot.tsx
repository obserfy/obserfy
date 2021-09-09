import { FC, useEffect, useState } from "react"
import { Button } from "theme-ui"
import { getSchoolId } from "../../hooks/schoolIdState"
import { getPreferredLang } from "../../i18n"
import { ReactComponent as ChatIcon } from "../../icons/message-circle.svg"
import Icon from "../Icon/Icon"
import LoadingIndicator from "../LoadingIndicator/LoadingIndicator"

const loadChatwoot = () => {
  window.chatwootSettings = {
    locale: getPreferredLang(),
    hideMessageBubble: true,
    position: "left",
  }

  const websiteToken =
    process.env.NODE_ENV === "development"
      ? "M3Q1fEiitx7xPHEh12xdvGQR"
      : "Hs61XyryoFYVv39MienCG2Ei"

  const t = "script"
  const BASE_URL = "https://app.chatwoot.com"
  const g = document.createElement(t)
  const s = document.getElementsByTagName(t)[0]
  g.src = `${BASE_URL}/packs/js/sdk.js`
  g.async = true
  s.parentNode?.insertBefore(g, s)
  g.onload = () => {
    window.chatwootSDK.run({
      websiteToken,
      baseUrl: BASE_URL,
    })
  }
}

export interface ChatwootProps {}
const Chatwoot: FC<ChatwootProps> = () => {
  // const [isLoaded, setIsLoaded] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleReady = () => {
    fetch("/api/v1/users", { credentials: "same-origin" })
      .then((user) => user.json())
      .then((user) => {
        window.$chatwoot.setUser(user.id, {
          email: user.email,
          name: user.name,
        })

        return fetch(`/api/v1/schools/${getSchoolId()}`, {
          credentials: "same-origin",
        })
      })
      .then((result) => result.json())
      .then((school) => {
        window.$chatwoot.setCustomAttributes({
          company: school.name,
        })
        window.$chatwoot.toggle()
        setIsLoading(false)
        // setIsLoaded(true)
      })
  }

  useEffect(() => {
    window.addEventListener("chatwoot:ready", handleReady)
  }, [])

  const handleClick = () => {
    if (isLoading) return

    if (window.$chatwoot === undefined) {
      setIsLoading(true)
      loadChatwoot()
    } else {
      window.$chatwoot.toggle()
    }
  }

  return (
    <Button
      variant="text"
      sx={{
        borderBottom: 0,
        alignItems: "center",
        flexDirection: "column",
        width: [56, 48],
        height: [56, 48],
        borderRadius: "circle",
      }}
      p={0}
      onClick={handleClick}
    >
      {isLoading ? (
        <LoadingIndicator />
      ) : (
        <Icon
          as={ChatIcon}
          size={26}
          fill="transparent"
          color="textMediumEmphasis"
        />
      )}
    </Button>
  )
}

export default Chatwoot
