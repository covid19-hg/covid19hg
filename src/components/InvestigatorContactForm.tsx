import React, { useReducer, useCallback, Dispatch } from "react";
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
  Action as PartnersAction,
  State as PartnersState,
} from "./Partners";
import CircularProgress from "@material-ui/core/CircularProgress";

const RECAPTCHA_KEY = process.env.GATSBY_SITE_RECAPTCHA_KEY;
if (typeof RECAPTCHA_KEY === "undefined") {
  throw new Error(`
  Env var GATSBY_APP_SITE_RECAPTCHA_KEY is undefined!
  You probably forget to set it in your Netlify build environment variables.
  Make sure to get a Recaptcha key at https://www.netlify.com/docs/form-handling/#custom-recaptcha-2-with-your-own-settings
  Note this demo is specifically for Recaptcha v2
  `);
}

const SET_STATE_ACTION_NAME = "SET_STATE";
const RESET_ACTION_NAME = "RESET";
const CAPTCHA_SOLVED = "CAPTCHA_SOLVED";

const nameStateName = "name";
const emailStateName = "email";
const messageStateName = "message";
const captchaValueStateName = "captchaValue";
const submitButtonEnabledStateName = "isSubmitButtonEnabled";
const submissionStatusStateName = "submissionStatus";

enum SubmissionStatus {
  Initial,
  Pending,
  Failed,
}

interface State {
  [nameStateName]: string;
  [emailStateName]: string;
  [messageStateName]: string;
  [captchaValueStateName]: string;
  [submitButtonEnabledStateName]: boolean;
  [submissionStatusStateName]: SubmissionStatus;
}

const initialState: State = {
  [nameStateName]: "",
  [emailStateName]: "",
  [messageStateName]: "",
  [captchaValueStateName]: "",
  [submitButtonEnabledStateName]: false,
  [submissionStatusStateName]: SubmissionStatus.Initial,
};

interface SetStateAction<K extends keyof State> {
  type: typeof SET_STATE_ACTION_NAME;
  payload: {
    name: K;
    value: State[K];
  };
}
interface CaptchaSolvedAction {
  type: typeof CAPTCHA_SOLVED;
  payload: {
    captchaValue: string;
  };
}
type Action<K extends keyof State> =
  | SetStateAction<K>
  | {
      type: typeof RESET_ACTION_NAME;
    }
  | CaptchaSolvedAction;

const reducer = <K extends keyof State>(
  state: State,
  action: Action<K>
): State => {
  switch (action.type) {
    case SET_STATE_ACTION_NAME:
      return {
        ...state,
        [action.payload.name]: action.payload.value,
      };
    case RESET_ACTION_NAME:
      return {
        ...state,
        ...initialState,
      };
    case CAPTCHA_SOLVED:
      return {
        ...state,
        [submitButtonEnabledStateName]: true,
        [captchaValueStateName]: action.payload.captchaValue,
      };
    default:
      return state;
  }
};

interface Props<K extends keyof PartnersState> {
  selectedId: string | undefined;
  isOpen: boolean;
  dispatchMessageToParent: Dispatch<PartnersAction<K>>;
}

const InvestigatorContactForm = <K extends keyof PartnersState>({
  selectedId,
  isOpen,
  dispatchMessageToParent,
}: Props<K>) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const closeContactForm = useCallback(() => {
    const action = {
      type: SET_PARENT_FORM_STATE,
      payload: {
        name: contactFormOpenStateName,
        value: false,
      },
    };
    // @ts-ignore Quite a complicated error
    // https://stackoverflow.com/questions/56505560/could-be-instantiated-with-a-different-subtype-of-constraint-object
    dispatchMessageToParent(action);
  }, [dispatchMessageToParent]);
  const onRecaptchaChange = (value: string) => {
    const action: CaptchaSolvedAction = {
      type: CAPTCHA_SOLVED,
      payload: {
        captchaValue: value,
      },
    };
    dispatch(action);
  };

  const showErrorMessage = useCallback(() => {
    const action: SetStateAction<typeof submissionStatusStateName> = {
      type: SET_STATE_ACTION_NAME,
      payload: {
        name: submissionStatusStateName,
        value: SubmissionStatus.Failed,
      },
    };
    dispatch(action);
  }, []);

  const resetContactForm = () => dispatch({ type: RESET_ACTION_NAME });
  const closeAndResetContactForm = () => {
    closeContactForm();
    resetContactForm();
  };

  const handleSubmit = async () => {
    const formData = {
      "g-recaptcha-response": state[captchaValueStateName],
      studyId: selectedId,
      [nameStateName]: state[nameStateName],
      [emailStateName]: state[emailStateName],
      [messageStateName]: state[messageStateName],
    };

    try {
      dispatch({
        type: SET_STATE_ACTION_NAME,
        payload: {
          name: submissionStatusStateName,
          value: SubmissionStatus.Pending,
        },
      });
      const response = await fetch("/.netlify/functions/contact-investigator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        closeAndResetContactForm();
      } else {
        showErrorMessage();
      }
    } catch (error) {
      console.log("error encountered");
      showErrorMessage();
    }
  };

  if (state[submissionStatusStateName] === SubmissionStatus.Failed) {
    return (
      <Dialog open={isOpen} onClose={closeAndResetContactForm}>
        <DialogTitle id="form-dialog-title">Error</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Unable to send email. Please try again.
          </DialogContentText>
          <DialogActions>
            <Button onClick={closeAndResetContactForm} color="primary">
              Cancel
            </Button>
            <Button onClick={resetContactForm} color="primary">
              Retry
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    );
  } else {
    let sendButtonContent: React.ReactChild,
      cancelButtonContent: React.ReactChild;
    let sendButtonClickHandler: React.MouseEventHandler<any> | undefined,
      cancelButtonClickHandler: React.MouseEventHandler<any> | undefined;
    if (state[submissionStatusStateName] === SubmissionStatus.Pending) {
      sendButtonContent = <CircularProgress size={20} />;
      cancelButtonContent = <CircularProgress size={20} />;
      sendButtonClickHandler = undefined;
      cancelButtonClickHandler = undefined;
    } else {
      sendButtonContent = "Send";
      cancelButtonContent = "Cancel";
      sendButtonClickHandler = handleSubmit;
      cancelButtonClickHandler = closeAndResetContactForm;
    }
    return (
      <Dialog open={isOpen} onClose={closeAndResetContactForm}>
        <DialogTitle id="form-dialog-title">Contact Investigator</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Fill in the form below to send an emali to the study's
            investigators.
          </DialogContentText>
          <form onSubmit={(e) => e.preventDefault()}>
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
            <Recaptcha sitekey={RECAPTCHA_KEY} onChange={onRecaptchaChange} />
            <DialogActions>
              <Button onClick={cancelButtonClickHandler} color="primary">
                {cancelButtonContent}
              </Button>
              <Button
                disabled={!state[submitButtonEnabledStateName]}
                color="primary"
                type="submit"
                onClick={sendButtonClickHandler}
              >
                {sendButtonContent}
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    );
  }
};

export default InvestigatorContactForm;
