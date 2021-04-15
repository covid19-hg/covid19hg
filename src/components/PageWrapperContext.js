// Taken from https://github.com/gatsbyjs/gatsby/tree/master/packages/gatsby-plugin-layout
// This is needed to preserve the expanded/collapsed state of the side bar nav.
import React from "react"

const defaultContextValue = {
  data: {
    largeNavMenuExpandedNodeIds: ["About", "News", "Data Sharing", "Results", "Acknowledgements"],
    largeNavMenuSelectedNodeIds: [],
  },
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  set: () => {}
}


const Context = React.createContext(defaultContextValue)

class ContextProviderComponent extends React.Component {
  constructor() {
    super()

    this.setData = this.setData.bind(this)
    this.state = {
      ...defaultContextValue,
      set: this.setData,
    }
  }

  setData(newData) {
    this.setState(state => ({
      data: {
        ...state.data,
        ...newData,
      },
    }))
  }

  render() {
    return <Context.Provider value={this.state}>{this.props.children}</Context.Provider>
  }
}

export { Context, ContextProviderComponent }
