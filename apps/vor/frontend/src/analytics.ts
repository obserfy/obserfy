export const track = (event: string, properties?: Object) => {
  if (window.analytics !== undefined) {
    window.analytics.track(event, properties)
  }
}

export const identify = (userId: string, traits?: Object) => {
  if (window.analytics !== undefined) {
    window.analytics.identify(userId, traits)
  }
}
