# SolDonate

This project aims to provide a simple tool to wrap any link into a Blink to accept donations.

This way, any user with limited coding/developing experience can share blinks that redirect to their content.
The blink will use the redirect URL to generate its metadata so social medias display it as the destination site.

## How it works

There are 2 pages to this project :

- The root (/) page, that allows the user to configure his Blink
- The /donate page, that shows the destination page infos and donation buttons/text field. This page uses the search params set via the root page setup tool to display the Blink and set its metadata (useful in case it isn't displayed as a Blink on the social media where it was posted, or if the viewer hasn't enabled Blinks in his wallet)

## The root page

<img width="545" alt="Capture d’écran 2024-07-11 à 00 06 35" src="https://github.com/silto/soldonate/assets/2432646/471c017e-f307-428f-9b09-d2061d232465">

This panel allows the user the configure his Blink.
You can set:
- the destination Sonala address for the donations
- which donation buttons to display with how much SOL to donate on each one (3 max)
- enable/disable a "free amount" input where the viewer can enter a SOL amount he wants to donate
- a fee field, where the user can choose how much of the donation goes to SolDonate (which can be disabled entirely)
- a redirect link, that will be wrapped with the donation Blink

Once this is all set up, you can click "Create Blink", which will open a modal with 2 options: a Blink URL and an Action URL.
The simplest way to use it is to copy the Blink URL and share it on social media. But you an also use the Action URL and unfurl it with dial.to for example.

## The Donation page

<img width="537" alt="Capture d’écran 2024-07-11 à 00 10 16" src="https://github.com/silto/soldonate/assets/2432646/3b52c8b7-fd98-443c-b7bb-8fc735a2dfc2">

Based on the settings entered on the root page, the Blink URL should show this page, with its content depending on the redirect URL.

When shared on twitter (an later on other supported social medias), the user wallet should display a Blink with the donation buttons. If the user doesn't have a Solana wallet or its Blink feature isn't enabled, he should see the same thing as if the redirect page was shared directly, but be sent to the donation page if he clicks on the link.

# Tech

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`c3`](https://developers.cloudflare.com/pages/get-started/c3).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Cloudflare integration

Besides the `dev` script mentioned above `c3` has added a few extra scripts that allow you to integrate the application with the [Cloudflare Pages](https://pages.cloudflare.com/) environment, these are:
  - `pages:build` to build the application for Pages using the [`@cloudflare/next-on-pages`](https://github.com/cloudflare/next-on-pages) CLI
  - `preview` to locally preview your Pages application using the [Wrangler](https://developers.cloudflare.com/workers/wrangler/) CLI
  - `deploy` to deploy your Pages application using the [Wrangler](https://developers.cloudflare.com/workers/wrangler/) CLI

> __Note:__ while the `dev` script is optimal for local development you should preview your Pages application as well (periodically or before deployments) in order to make sure that it can properly work in the Pages environment (for more details see the [`@cloudflare/next-on-pages` recommended workflow](https://github.com/cloudflare/next-on-pages/blob/05b6256/internal-packages/next-dev/README.md#recommended-workflow))

### Bindings

Cloudflare [Bindings](https://developers.cloudflare.com/pages/functions/bindings/) are what allows you to interact with resources available in the Cloudflare Platform.

You can use bindings during development, when previewing locally your application and of course in the deployed application:

- To use bindings in dev mode you need to define them in the `next.config.js` file under `setupDevBindings`, this mode uses the `next-dev` `@cloudflare/next-on-pages` submodule. For more details see its [documentation](https://github.com/cloudflare/next-on-pages/blob/05b6256/internal-packages/next-dev/README.md).

- To use bindings in the preview mode you need to add them to the `pages:preview` script accordingly to the `wrangler pages dev` command. For more details see its [documentation](https://developers.cloudflare.com/workers/wrangler/commands/#dev-1) or the [Pages Bindings documentation](https://developers.cloudflare.com/pages/functions/bindings/).

- To use bindings in the deployed application you will need to configure them in the Cloudflare [dashboard](https://dash.cloudflare.com/). For more details see the  [Pages Bindings documentation](https://developers.cloudflare.com/pages/functions/bindings/).

#### KV Example

`c3` has added for you an example showing how you can use a KV binding.

In order to enable the example:
- Search for javascript/typescript lines containing the following comment:
  ```ts
  // KV Example:
  ```
  and uncomment the commented lines below it.
- Do the same in the `wrangler.toml` file, where
  the comment is:
  ```
  # KV Example:
  ```
- If you're using TypeScript run the `cf-typegen` script to update the `env.d.ts` file:
  ```bash
  npm run cf-typegen
  # or
  yarn cf-typegen
  # or
  pnpm cf-typegen
  # or
  bun cf-typegen
  ```

After doing this you can run the `dev` or `preview` script and visit the `/api/hello` route to see the example in action.

Finally, if you also want to see the example work in the deployed application make sure to add a `MY_KV_NAMESPACE` binding to your Pages application in its [dashboard kv bindings settings section](https://dash.cloudflare.com/?to=/:account/pages/view/:pages-project/settings/functions#kv_namespace_bindings_section). After having configured it make sure to re-deploy your application.
