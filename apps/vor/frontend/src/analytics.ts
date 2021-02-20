export const track = (event: string, properties?: Object) => {
  if (window.analytics !== undefined) {
    window.analytics.track(event, properties)
  }
}
