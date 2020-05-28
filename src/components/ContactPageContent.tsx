// Adapted from
// https://github.com/sw-yx/gatsby-netlify-form-example-v2/blob/master/src/pages/recaptcha.js

import React, { useState, useRef } from "react";
import { navigate } from "gatsby-link";
import Recaptcha from "react-google-recaptcha";
import { Container } from "./materialUIContainers";
import TextField from "@material-ui/core/TextField";
import { makeStyles, Theme, Button } from "@material-ui/core";

const RECAPTCHA_KEY = process.env.GATSBY_SITE_RECAPTCHA_KEY;
if (typeof RECAPTCHA_KEY === "undefined") {
  throw new Error(`
  Env var GATSBY_APP_SITE_RECAPTCHA_KEY is undefined!
  You probably forget to set it in your Netlify build environment variables.
  Make sure to get a Recaptcha key at https://www.netlify.com/docs/form-handling/#custom-recaptcha-2-with-your-own-settings
  Note this demo is specifically for Recaptcha v2
  `);
}

const encode = (data: any) => {
  return Object.keys(data)
    .map((key) => encodeURIComponent(key) + "=" + encodeURIComponent(data[key]))
    .join("&");
};

const formElementMargin = 2;
const useStyles = makeStyles((theme: Theme) => ({
  input: {
    margin: theme.spacing(formElementMargin),
  },
}));

const ContactPageContent = () => {
  const [state, setState] = useState({});
  const [submitButtonEnabled, setSubmitButtonEnabled] = useState(false);
  const recaptchaRef = useRef<Recaptcha | null>(null);
  const classes = useStyles();

  const handleChange = (e: React.ChangeEvent) => {
    const target = e.target as HTMLInputElement;
    setState({ ...state, [target.name]: target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const recaptchaInstance = recaptchaRef.current;
    if (recaptchaInstance !== null) {
      const recaptchaValue = recaptchaInstance.getValue();
      fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: encode({
          "form-name": form.getAttribute("name"),
          "g-recaptcha-response": recaptchaValue,
          ...state,
        }),
      })
        .then(() => navigate(form.getAttribute("action")!))
        .catch((error) => alert(error));
    }
  };

  const onRecaptchaChange = (val: string | undefined) => {
    if (!!val) {
      setSubmitButtonEnabled(true);
    }
  };

  return (
    <Container marginTop={2} fixed={true}>
      <form
        name="contact-recaptcha"
        method="post"
        action="/contact/thanks/"
        data-netlify="true"
        data-netlify-recaptcha="true"
        onSubmit={handleSubmit}
      >
        <noscript>
          <p>This form won’t work with Javascript disabled</p>
        </noscript>
        <TextField
          variant="outlined"
          label="Your Name"
          fullWidth={true}
          className={classes.input}
          onChange={handleChange}
        />
        <TextField
          variant="outlined"
          label="Email"
          fullWidth={true}
          className={classes.input}
          onChange={handleChange}
        />
        <TextField
          variant="outlined"
          label="Message"
          multiline={true}
          fullWidth={true}
          className={classes.input}
          onChange={handleChange}
        />
        <Container disableGutters={true} margin={formElementMargin}>
          <Recaptcha
            ref={recaptchaRef}
            sitekey={RECAPTCHA_KEY}
            onChange={onRecaptchaChange}
          />
        </Container>
        <Container disableGutters={true} margin={formElementMargin}>
          <Button
            variant="contained"
            disabled={!submitButtonEnabled}
            type="submit"
          >
            Send
          </Button>
        </Container>
      </form>
    </Container>
  );
};

export default ContactPageContent;
