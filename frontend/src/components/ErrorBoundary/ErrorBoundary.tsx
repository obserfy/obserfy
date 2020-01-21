import React, { Component, ReactNode } from "react"
import { getAnalytics } from "../../analytics"
import PageError from "../PageError/PageError"

interface Props {
  title: string
}
interface State {
  hasError: boolean
}
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    getAnalytics()?.track("Javsacript Error", {
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
