import browserLang from "browser-lang"
import "./src/global.css"
import { navigate, withPrefix } from "gatsby"
import { getSchoolId } from "./src/hooks/schoolIdState"

// Disabled because it currently breaks due to gatsby's changes.
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
// export const shouldUpdateScroll = ({
//   prevRouterProps: { location },
//   routerProps,
//   getSavedScrollPosition,
// }) => {
//   // =============== What is all of this??? ==============================
//   // This is a simple hack to preserve scroll position for some navigation links
//   // (such as link for going back and bottom navigation link).
//
//   // Get scroll position of the current page the user in
//   const lastPosition = getSavedScrollPosition(location)
//   // undocumented internals.
//   window.sessionStorage.setItem(
//     `@@scroll|${location.pathname}`,
//     JSON.stringify(lastPosition)
//   )
//   console.log(`@@scroll|${location.pathname}`)
//
//   // If state.preserveScroll is true, we'll use the last known
//   // scroll position of the given pathname, and scroll to it.
//   if (routerProps.location.state?.preserveScroll) {
//     const currentPosition = window.sessionStorage.getItem(
//       `@@scroll|${routerProps.location.pathname}`
//     )
//     const position = JSON.parse(currentPosition)
//     window.scrollTo(...(position || [0, 0]))
//
//     console.log(currentPosition)
//     console.log(routerProps.location.pathname)
//     return false
//   }
//
//   return true
// }

export const onServiceWorkerUpdateReady = () => {
  if (window.updateAvailable) {
    window.updateAvailable()
  }
}

export const onClientEntry = () => {
  window.analytics.on("page", function (event, properties, options) {
    const breadcrumb = {
      category: "page",
      level: "info",
      data: options,
    }
    window.Sentry.addBreadcrumb(breadcrumb)
  })

  window.analytics.on("track", function (event, properties, options) {
    const breadcrumb = {
      category: "track",
      level: "info",
      data: properties,
    }
    window.Sentry.addBreadcrumb(breadcrumb)
  })

  window.analytics.on("identify", function (event, properties, options) {
    const user = {
      id: event,
      username: properties.name,
      email: properties.email,
    }
    Sentry.setUser(user)
  })
}

const LANG_PREFERENCE_KEY = "preferred-lang"
const getPreferredLang = () => {
  return (
    window.localStorage.getItem(LANG_PREFERENCE_KEY) ||
    browserLang({
      languages: ["en", "id"],
      fallback: "en",
    })
  )
}
// For redirecting user to preferred language
export const wrapPageElement = (params) => {
  // find user preferred language
  let preferredLang = getPreferredLang()

  // Generate url with changed language
  const { search } = params.props.location
  const queryParams = search || ""
  let newUrl = withPrefix(
    `${preferredLang === "id" ? "/id" : ""}${
      params.props.pageContext.originalPath
    }${queryParams}`
  )
  // if original path is root, it will introduce trailing slashes
  // this removes it
  if (newUrl === `/${preferredLang}/`) newUrl = "/id"

  // Save the preferred language and navigate away to it
  window.localStorage.setItem(LANG_PREFERENCE_KEY, preferredLang)
  if (
    window.location.pathname + queryParams !== newUrl &&
    window.location.pathname.replace(/\/$/, "") + queryParams !== newUrl
  )
    navigate(newUrl)

  return params.element
}

const detectMobile = function () {
  let check = false
  ;(function (a) {
    if (
      /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
        a
      ) ||
      /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
        a.substr(0, 4)
      )
    )
      check = true
  })(navigator.userAgent || navigator.vendor || window.opera)
  return check
}

const loadChatwoot = () => {
  window.chatwootSettings = {
    locale: getPreferredLang(),
  }

  window.addEventListener("chatwoot:ready", function () {
    fetch("/api/v1/users", { credentials: "same-origin" })
      .then((user) => {
        return user.json()
      })
      .then((user) => {
        window.$chatwoot.setUser(user.id, {
          email: user.email,
          name: user.name,
        })

        return fetch(`/api/v1/schools/${getSchoolId()}`, {
          credentials: "same-origin",
        })
      })
      .then((school) => {
        window.$chatwoot.setCustomAttributes({
          company: school.name,
        })
      })
  })

  setTimeout(() => {
    const t = "script"
    const BASE_URL = "https://app.chatwoot.com"
    const g = document.createElement(t)
    const s = document.getElementsByTagName(t)[0]
    g.src = BASE_URL + "/packs/js/sdk.js"
    g.async = true
    s.parentNode.insertBefore(g, s)
    g.onload = function () {
      let websiteToken
      if (process.env.NODE_ENV === "development") {
        websiteToken = "M3Q1fEiitx7xPHEh12xdvGQR"
      } else {
        websiteToken = "Hs61XyryoFYVv39MienCG2Ei"
      }
      window.chatwootSDK.run({
        websiteToken,
        baseUrl: BASE_URL,
      })
    }
  }, 2000)
}

// Add chatwoot
export const onInitialClientRender = () => {
  const hasTouchScreen = detectMobile()
  if (!hasTouchScreen) {
    loadChatwoot()
  }
}
