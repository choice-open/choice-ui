import { Button } from "@choiceform/button"
import React from "react"

interface ErrorBoundaryState {
  error?: Error
  errorInfo?: React.ErrorInfo
  hasError: boolean
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{
    error?: Error
    retry: () => void
  }>
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
}

export class VirtualizedGridErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("VirtualizedGrid Error:", error, errorInfo)
    this.setState({ errorInfo })
    this.props.onError?.(error, errorInfo)
  }

  retry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback
        return (
          <FallbackComponent
            error={this.state.error}
            retry={this.retry}
          />
        )
      }

      return (
        <div className="p-4 text-center">
          <h3>VirtualizedGrid Error</h3>
          <p>The component encountered an unexpected error during rendering</p>
          <Button
            onClick={this.retry}
            variant="secondary"
            className="mt-2"
          >
            Retry
          </Button>
          {typeof window !== "undefined" && this.state.error && (
            <details className="mt-2 text-left">
              <summary>Error Details</summary>
              <pre className="text-body-small overflow-auto">{this.state.error.stack}</pre>
            </details>
          )}
        </div>
      )
    }

    return this.props.children
  }
}
