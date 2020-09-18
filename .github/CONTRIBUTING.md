## Project setup

Before starting development, you'll need to have the following software installed on your machine:
- A recent version of [NodeJS](https://nodejs.org/en/).
Node 12 is recommended.
- A recent version of Yarn.
Yarn 1.22 is recommended.

After that, set up the project as follows:
- Clone the repo.
- `cd` into the project directory and run `yarn` to install the dependencies.
- `yarn netlify login` to authenticate with Netlify.
This [link](https://docs.netlify.com/cli/get-started/#obtain-a-token-via-the-command-line) shows the permission dialog that you should expect to see.
- `yarn netlify link --name condescending-perlman-ec107b`.
- `yarn netlify dev` to start a local development server.
This command will securely download environment variables and use them in the development build.
After a few minutes, the server will be ready and you can access it on port `8888` of `localhost`.
You can safely ignore the following warning message if it shows up in the terminal: `warning: Cannot load local env variables [...].`.
- If you want to run a production build locally (for example, to troubleshoot a failed build on the server), run `yarn netlify build`.

# Netlify functions

You can create and develop Netlify functions locally using the Netlify CLI.
If you use `netlify dev` to locally develop the front-end, the front-end will use the local version of Netlify functions.
This allows you to develop and test Netlify functions locally before deploying to production.

- To create a new Netlify function, run [`yarn netlify functions:create [function-name]`](https://cli.netlify.com/commands/functions/#functionscreate).
You will be offered a number of templates to choose from.
Usually those templates are good enough for the functionality that this website needs.
- To manually invoke a Netlify function for testing, run [`yarn netlify functions:invoke [function-name] --no-identity`](https://cli.netlify.com/commands/functions/#functionsinvoke).
For example, to invoke the `partners` function (responsible for fetching data for the Partners page), run `yarn netlify functions:invoke partners --no-identity`.

## Unit tests

This project contains a few small unit tests.
You can run them by running:
- `yarn jest` to run the tests once
- `yarn jest:watch` to run the tests in interactive watch mode.

## Integration tests:

To run the Cypress integration tests:
- In one terminal window, run `yarn netlify dev`.
- In another terminal window, run `yarn cypress:open`.
This will open a UI where you can select which test suites to run.




