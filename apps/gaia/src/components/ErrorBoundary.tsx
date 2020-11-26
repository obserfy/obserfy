import React, { Component, ReactNode } from "react"
import * as Sentry from "@sentry/node"

interface State {
  hasError: boolean
}
export class ErrorBoundary extends Component<{}, State> {
  constructor(props: {}) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    if (process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.error(error)
    }
    Sentry.captureException(error)
    mixpanel.track("Javascript Error", { error, errorInfo })
  }

  render(): ReactNode {
    const { children } = this.props
    const { hasError } = this.state
    if (hasError) {
      // render fallback UI
      return <div>Oops, something went wrong</div>
    }
    return children
  }
}

export default ErrorBoundary
