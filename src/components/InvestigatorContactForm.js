import React, { useReducer, useCallback, useRef } from "react";
import Recaptcha from "react-google-recaptcha";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import {
  SET_FORM_STATE as SET_PARENT_FORM_STATE,
  contactFormOpenStateName,
} from "./Partners";

const RECAPTCHA_KEY = process.env.GATSBY_SITE_RECAPTCHA_KEY;
if (typeof RECAPTCHA_KEY === "undefined") {
  throw new Error(`
  Env var GATSBY_APP_SITE_RECAPTCHA_KEY is undefined!
  You probably forget to set it in your Netlify build environment variables.
  Make sure to get a Recaptcha key at https://www.netlify.com/docs/form-handling/#custom-recaptcha-2-with-your-own-settings
  Note this demo is specifically for Recaptcha v2
  `);
}

const nameStateName = "name";
const emailStateName = "email";
const messageStateName = "message";
const submitButtonEnabledStateName = "isSubmitButtonEnabled";
const formSubmissionFailureStateName = "hasFormSubmissionFailed";

const defaultFormState = {
  [nameStateName]: "",
  [emailStateName]: "",
  [messageStateName]: "",
  [submitButtonEnabledStateName]: false,
  [formSubmissionFailureStateName]: false,
};

const SET_STATE_ACTION_NAME = "SET_STATE";
const RESET_ACTION_NAME = "RESET";

const reducer = (state, action) => {
  switch (action.type) {
    case SET_STATE_ACTION_NAME:
      return {
        ...state,
        [action.payload.name]: action.payload.value,
      };
    case RESET_ACTION_NAME:
      return {
        ...state,
        ...defaultFormState,
      };
    default:
      return state;
  }
};

const InvestigatorContactForm = ({
  selectedId,
  isOpen,
  dispatchMessageToParent,
}) => {
  const [state, dispatch] = useReducer(reducer, defaultFormState);

  const closeContactForm = useCallback(
    () =>
      dispatchMessageToParent({
        type: SET_PARENT_FORM_STATE,
        payload: {
          name: contactFormOpenStateName,
          value: false,
        },
      }),
    [dispatchMessageToParent]
  );
  const onRecaptchaChange = (val) => {
    if (!!val) {
      dispatch({
        type: SET_STATE_ACTION_NAME,
        payload: {
          name: submitButtonEnabledStateName,
          value: true,
        },
      });
    }
  };

  const recaptchaRef = useRef(null);
  const rememberRecaptchaEl = useCallback((el) => {
    recaptchaRef.current = el;
  }, []);

  const showErrorMessage = useCallback(
    () =>
      dispatch({
        type: SET_STATE_ACTION_NAME,
        payload: {
          name: formSubmissionFailureStateName,
          value: true,
        },
      }),
    []
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    const recaptchaValue = recaptchaRef.current.getValue();
    const formData = {
      "g-recaptcha-response": recaptchaValue,
      studyId: selectedId,
      [nameStateName]: state[nameStateName],
      [emailStateName]: state[emailStateName],
      [messageStateName]: state[messageStateName],
    };
    try {
      const response = await fetch("/.netlify/functions/contact-investigator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        closeContactForm();
      } else {
        showErrorMessage();
      }
    } catch (error) {
      console.log("error encountered");
      showErrorMessage();
    }
  };

  if (state[formSubmissionFailureStateName] === true) {
    return (
      <Dialog open={isOpen} onClose={closeContactForm}>
        <DialogTitle id="form-dialog-title">Error</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Unable to send email. Please try again.
          </DialogContentText>
          <DialogActions>
            <Button onClick={closeContactForm} color="primary">
              Cancel
            </Button>
            <Button
              onClick={() => dispatch({ type: RESET_ACTION_NAME })}
              color="primary"
            >
              Retry
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    );
  } else {
    return (
      <Dialog open={isOpen} onClose={closeContactForm}>
        <DialogTitle id="form-dialog-title">Contact Investigator</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Fill in the form below to send an emali to the study's
            investigators.
          </DialogContentText>
          <form>
            <TextField
              label="Name"
              required={true}
              fullWidth={true}
              margin="normal"
              onChange={(e) =>
                dispatch({
                  type: SET_STATE_ACTION_NAME,
                  payload: {
                    name: nameStateName,
                    value: e.target.value,
                  },
                })
              }
            />
            <TextField
              label="Email"
              required={true}
              fullWidth={true}
              margin="normal"
              onChange={(e) =>
                dispatch({
                  type: SET_STATE_ACTION_NAME,
                  payload: {
                    name: emailStateName,
                    value: e.target.value,
                  },
                })
              }
            />
            <TextField
              label="Message"
              required={true}
              fullWidth={true}
              multiline={true}
              margin="normal"
              onChange={(e) =>
                dispatch({
                  type: SET_STATE_ACTION_NAME,
                  payload: {
                    name: messageStateName,
                    value: e.target.value,
                  },
                })
              }
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
                disabled={false}
                color="primary"
                type="submit"
                onClick={handleSubmit}
              >
                Send
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    );
  }
};

export default InvestigatorContactForm;
