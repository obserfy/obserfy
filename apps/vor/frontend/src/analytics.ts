import { Severity } from "@sentry/gatsby"

export const track = (event: string, properties?: Object) => {
  if (process.env.NODE_ENV === "development") return

  if (typeof window !== "undefined" && window.mixpanel !== undefined) {
    mixpanel.track(event, properties)
  }

  if (typeof Sentry !== "undefined") {
    const breadcrumb = {
      category: "track",
      level: Severity.Info,
      data: properties,
    }
    Sentry.addBreadcrumb(breadcrumb)
  }
}

export const identify = (userId: string, traits?: Object) => {
  if (process.env.NODE_ENV === "development") return

  if (typeof window !== "undefined" && window.mixpanel !== undefined) {
    mixpanel.identify(userId)
    mixpanel.people.set(traits)
  }

  if (typeof Sentry !== "undefined") {
    const user = { id: userId, ...traits }
    Sentry.setUser(user)
  }
}

export const captureException = (e: Error) => {
  if (typeof window !== "undefined" && window.mixpanel !== undefined) {
    captureException(e)
  }
}
