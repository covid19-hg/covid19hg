declare module "react-google-recaptcha" {
  import React from "react";
  interface Props {
    sitekey: string;
    onChange: (value: string) => void;
  }
  class ReactGoogleRecaptcha extends React.Component<Props> {
    getValue: () => string | undefined;
  }
  export default ReactGoogleRecaptcha;
}
