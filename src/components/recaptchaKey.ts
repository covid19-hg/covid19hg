let RECAPTCHA_KEY = process.env.GATSBY_SITE_RECAPTCHA_KEY!;
if (typeof RECAPTCHA_KEY === "undefined") {
  throw new Error(`
  Env var GATSBY_APP_SITE_RECAPTCHA_KEY is undefined!
  You probably forget to set it in your Netlify build environment variables.
  Make sure to get a Recaptcha key at https://www.netlify.com/docs/form-handling/#custom-recaptcha-2-with-your-own-settings
  Note this demo is specifically for Recaptcha v2
  `);
}

// This is necessary to avoid "window is not defined" error during server rendering:
// https://github.com/gatsbyjs/gatsby/issues/17667#issue-494051999
if (typeof window === "undefined") {
  (global as any).window = {};
}

if ((window as any).Cypress) {
  // Use special recaptcha key in cypress test so we don't have to solve any captcha:
  // https://developers.google.com/recaptcha/docs/faq#id-like-to-run-automated-tests-with-recaptcha.-what-should-i-do
  RECAPTCHA_KEY = "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI";
}

export default RECAPTCHA_KEY;
