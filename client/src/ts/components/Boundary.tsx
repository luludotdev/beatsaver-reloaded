import React, { Component, ErrorInfo } from 'react'

interface IState {
  hasError: boolean
  error: Error | undefined
  info: ErrorInfo | undefined
}

export class Boundary extends Component<{}, IState> {
  public static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  private errorListener: (ev: ErrorEvent) => void

  constructor(props: any) {
    super(props)

    this.state = {
      error: undefined,
      hasError: false,
      info: undefined,
    }

    this.errorListener = ev => {
      this.setState({ hasError: true, error: ev.error })
      return false
    }
  }

  public componentDidMount() {
    window.addEventListener('error', this.errorListener)
  }

  public componentWillUnmount() {
    window.removeEventListener('error', this.errorListener)
  }

  public componentDidCatch(error: Error, info: ErrorInfo) {
    this.setState({ error, info })
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div>
          <h1>BeatSaver has crashed!</h1>
          {this.state.error === undefined ? null : (
            <details style={{ maxHeight: '288px', overflowY: 'scroll' }}>
              <summary style={{ outline: 'none' }}>Stack Trace</summary>
              <pre>{this.state.error.stack}</pre>
            </details>
          )}
        </div>
      )
    }

    return this.props.children
  }
}
