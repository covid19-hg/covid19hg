// Adapted from
// https://github.com/sw-yx/gatsby-netlify-form-example-v2/blob/master/src/pages/recaptcha.js

import React, { useState, createRef } from "react";
import Layout from "../../components/NewLayout";
import { navigate } from "gatsby-link";
import Recaptcha from "react-google-recaptcha";
import useCanonicalLinkMetaTag from "../../components/useCanonicalLinkMetaTag";
import ContactPageContent from "../../components/ContactPageContent";

const RECAPTCHA_KEY = process.env.GATSBY_SITE_RECAPTCHA_KEY;
if (typeof RECAPTCHA_KEY === "undefined") {
  throw new Error(`
  Env var GATSBY_APP_SITE_RECAPTCHA_KEY is undefined!
  You probably forget to set it in your Netlify build environment variables.
  Make sure to get a Recaptcha key at https://www.netlify.com/docs/form-handling/#custom-recaptcha-2-with-your-own-settings
  Note this demo is specifically for Recaptcha v2
  `);
}
const encode = (data) => {
  return Object.keys(data)
    .map((key) => encodeURIComponent(key) + "=" + encodeURIComponent(data[key]))
    .join("&");
};

const Index = () => {
  const [state, setState] = useState({});
  const [submitButtonEnabled, setSubmitButtonEnabled] = useState(false);
  const recaptchaRef = createRef();
  const canonicalLinkMetaTag = useCanonicalLinkMetaTag("/contact/");

  const handleChange = (e) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const recaptchaValue = recaptchaRef.current.getValue();
    fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: encode({
        "form-name": form.getAttribute("name"),
        "g-recaptcha-response": recaptchaValue,
        ...state,
      }),
    })
      .then(() => navigate(form.getAttribute("action")))
      .catch((error) => alert(error));
  };

  const onRecaptchaChange = (val) => {
    if (!!val) {
      setSubmitButtonEnabled(true);
    }
  };

  return (
    <Layout>
      {canonicalLinkMetaTag}
      <ContactPageContent />
    </Layout>
  );

  return (
    <Layout>
      {canonicalLinkMetaTag}
      <section className="section">
        <div className="container">
          <div className="content">
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

              <div className="field">
                <label className="label" htmlFor={"name"}>
                  Your name
                </label>
                <div className="control">
                  <input
                    className="input"
                    type={"text"}
                    name={"name"}
                    onChange={handleChange}
                    id={"name"}
                    required={true}
                  />
                </div>
              </div>
              <div className="field">
                <label className="label" htmlFor={"email"}>
                  Email
                </label>
                <div className="control">
                  <input
                    className="input"
                    type={"email"}
                    name={"email"}
                    onChange={handleChange}
                    id={"email"}
                    required={true}
                  />
                </div>
              </div>
              <div className="field">
                <label className="label" htmlFor={"message"}>
                  Message
                </label>
                <div className="control">
                  <textarea
                    className="textarea"
                    name={"message"}
                    onChange={handleChange}
                    id={"message"}
                    required={true}
                  />
                </div>
              </div>
              <Recaptcha
                ref={recaptchaRef}
                sitekey={RECAPTCHA_KEY}
                onChange={onRecaptchaChange}
              />
              <div className="field">
                <button
                  className="button is-link"
                  type="submit"
                  disabled={!submitButtonEnabled}
                >
                  Send
                </button>
              </div>
            </form>
          </div>
        </div>
        <center>
          <p>
            <strong>Website team: </strong> Matthew Solomonson, Huy Nguyen
          </p>
        </center>
      </section>
    </Layout>
  );
};

export default Index;
