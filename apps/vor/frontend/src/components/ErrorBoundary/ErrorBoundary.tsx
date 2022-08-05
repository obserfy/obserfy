import { Component, ReactNode } from "react"
import { track } from "../../analytics"

import PageError from "../PageError/PageError"

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

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    if (process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.error(error)
      return
    }
    Sentry.configureScope((scope: any) => {
      Object.keys(errorInfo).forEach((key) => {
        scope.setExtra(key, errorInfo[key])
      })
    })
    Sentry.captureException(error)
    track("Javascript Error", {
      error,
      errorInfo,
    })
  }

  render(): ReactNode {
    const { children } = this.props
    const { hasError } = this.state
    if (hasError) {
      // render fallback UI
      return <PageError />
    }
    return children
  }
}

export default ErrorBoundary
