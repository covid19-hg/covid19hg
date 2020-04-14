import React, { useState, useCallback, useRef } from "react";
import Recaptcha from "react-google-recaptcha";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { SET_FORM_STATE, contactFormOpenStateName } from "./Partners";

const RECAPTCHA_KEY = process.env.GATSBY_SITE_RECAPTCHA_KEY;
if (typeof RECAPTCHA_KEY === "undefined") {
  throw new Error(`
  Env var GATSBY_APP_SITE_RECAPTCHA_KEY is undefined!
  You probably forget to set it in your Netlify build environment variables.
  Make sure to get a Recaptcha key at https://www.netlify.com/docs/form-handling/#custom-recaptcha-2-with-your-own-settings
  Note this demo is specifically for Recaptcha v2
  `);
}

const InvestigatorContactForm = ({
  selectedId,
  isOpen,
  dispatchMessageToParent,
}) => {
  const [contactFormState, setContactFormState] = useState({});
  const handleContactFormChange = (e) => {
    setContactFormState({
      ...contactFormState,
      [e.target.name]: e.target.value,
    });
  };
  const [
    isContactFormSubmitButtonEnabled,
    setIsContactFormSubmitButtonEnabled,
  ] = useState(false);

  const nameInputRef = useRef(null);
  const nameInputElCallback = useCallback((el) => {
    nameInputRef.current = el;
  }, []);
  const emailInputRef = useRef(null);
  const emailInputElCallback = useCallback((el) => {
    emailInputRef.current = el;
  }, []);
  const messageInputRef = useRef(null);
  const messageInputElCallback = useCallback((el) => {
    messageInputRef.current = el;
  }, []);

  const closeContactForm = useCallback(
    () =>
      dispatchMessageToParent({
        type: SET_FORM_STATE,
        payload: {
          name: contactFormOpenStateName,
          value: false,
        },
      }),
    [dispatchMessageToParent]
  );
  const onRecaptchaChange = (val) => {
    if (!!val) {
      setIsContactFormSubmitButtonEnabled(true);
    }
  };

  const recaptchaRef = useRef(null);
  const rememberRecaptchaEl = useCallback((el) => {
    recaptchaRef.current = el;
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const recaptchaValue = recaptchaRef.current.getValue();
    const formData = {
      "g-recaptcha-response": recaptchaValue,
      studyId: selectedId,
      ...contactFormState,
    };
    try {
      const response = await fetch("/.netlify/functions/contact-investigator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
    } catch (error) {
      // Show error message visually in the form
      console.error(error);
    }
  };
  return (
    <Dialog
      open={isOpen}
      onClose={closeContactForm}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">Contact Investigator</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Fill in the form below to send an emali to the study's investigators.
        </DialogContentText>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Name"
            required={true}
            fullWidth={true}
            margin="normal"
            name="name"
            onChange={handleContactFormChange}
            ref={nameInputElCallback}
          />
          <TextField
            label="Email"
            required={true}
            fullWidth={true}
            margin="normal"
            name="email"
            onChange={handleContactFormChange}
            ref={emailInputElCallback}
          />
          <TextField
            label="Message"
            required={true}
            fullWidth={true}
            multiline={true}
            margin="normal"
            name="message"
            onChange={handleContactFormChange}
            ref={messageInputElCallback}
          />
          <Recaptcha
            ref={rememberRecaptchaEl}
            sitekey={RECAPTCHA_KEY}
            onChange={onRecaptchaChange}
          />
          <DialogActions>
            <Button onClick={closeContactForm} color="primary">
              Cancel
            </Button>
            <Button
              onClick={closeContactForm}
              disabled={!isContactFormSubmitButtonEnabled}
              color="primary"
              type="submit"
            >
              Send
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default InvestigatorContactForm;
