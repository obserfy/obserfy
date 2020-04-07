import { Component, ReactPortal } from "react"
import ReactDOM from "react-dom"

// Use a ternary operator to make sure that the document object is defined
const portalRoot =
  typeof document !== `undefined` ? document.getElementById("portal") : null

export default class Portal extends Component {
  el = typeof document !== `undefined` ? document.createElement("div") : null

  componentDidMount = (): void => {
    if (this.el) {
      portalRoot?.appendChild(this.el)
    }
  }

  componentWillUnmount = (): void => {
    if (this.el) {
      portalRoot?.removeChild(this.el)
    }
  }

  render(): ReactPortal | null {
    const { children } = this.props

    // Check that this.el is not null before using ReactDOM.createPortal
    if (this.el) {
      return ReactDOM.createPortal(children, this.el)
    }
    return null
  }
}
