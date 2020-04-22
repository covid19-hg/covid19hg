declare module "react-google-recaptcha" {
  import React from "react"
  interface Props {
    sitekey: string
    onChange: (value: string) => void
  }
  const output: React.ComponentType<Props>
  export default output
}
