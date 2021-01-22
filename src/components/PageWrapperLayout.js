// Taken from https://github.com/gatsbyjs/gatsby/tree/master/packages/gatsby-plugin-layout
// This is needed to preserve the expanded/collapsed state of the side bar nav.
import React from "react"
import { ContextProviderComponent } from "./PageWrapperContext"

export default ({ children }) => (
  <ContextProviderComponent>
    {children}
  </ContextProviderComponent>
)
