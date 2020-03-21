import React, { Component, ReactNode } from "react"
import { getAnalytics } from "../../analytics"
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
    Sentry.configureScope(scope => {
      Object.keys(errorInfo).forEach(key => {
        scope.setExtra(key, errorInfo[key])
      })
    })
    Sentry.captureException(error)
    getAnalytics()?.track("Javascript Error", {
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
