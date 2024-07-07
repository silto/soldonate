import {
  ACTIONS_CORS_HEADERS,
  ActionGetResponse,
  LinkedAction,
} from "@solana/actions";
import validatedQueryParams from "./validateQueryParams";
import * as cheerio from "cheerio";

const getActionFromSearchParams = async (
  searchParams: URLSearchParams
): Promise<{ payload?: ActionGetResponse; error?: string }> => {
  try {
    const {
      toPubkey,
      amount1,
      amount2,
      amount3,
      freeAmountEnabled,
      fee,
      redirect,
    } = validatedQueryParams(searchParams);

    let iconUrl = new URL(
      "/solana_devs.jpg",
      process.env.NEXT_PUBLIC_BASE_URL
    ).toString();
    let title = "Donate SOL";
    let description = "Make a donation";
    if (redirect) {
      try {
        const response = await fetch(redirect, { next: { revalidate: 3600 } });
        const html = await response.text();
        const $ = cheerio.load(html);
        const twitterImage = $('meta[name="twitter:image"]').attr("content");
        const ogImage = $('meta[property="og:image"]').attr("content");
        const pageTitle = $("title").contents().first().text();
        const pageDescription = $('meta[name="description"]').attr("content");
        if (twitterImage) {
          iconUrl = twitterImage;
        } else if (ogImage) {
          iconUrl = ogImage;
        }
        if (pageTitle) {
          title = pageTitle;
        }
        if (pageDescription) {
          description = pageDescription;
        }
      } catch (error) {
        console.log(error);
      }
    }

    const baseHref = new URL(
      `/api/actions/donate?to=${toPubkey.toBase58()}${
        fee ? `&fee=${fee}` : ""
      }`,
      process.env.NEXT_PUBLIC_BASE_URL
    ).toString();

    const payload: ActionGetResponse = {
      title,
      icon: iconUrl,
      description,
      label: "Transfer", // this value will be ignored since `links.actions` exists
      links: {
        actions: [
          ...(amount1
            ? [
                {
                  label: `Donate ${amount1} SOL`, // button text
                  href: `${baseHref}&amount=${amount1}`,
                },
              ]
            : []),
          ...(amount2
            ? [
                {
                  label: `Donate ${amount2} SOL`, // button text
                  href: `${baseHref}&amount=${amount2}`,
                },
              ]
            : []),
          ...(amount3
            ? [
                {
                  label: `Donate ${amount3} SOL`, // button text
                  href: `${baseHref}&amount=${amount3}`,
                },
              ]
            : []),
          ...(freeAmountEnabled
            ? [
                {
                  label: "Donate", // button text
                  href: `${baseHref}&amount={amount}`, // this href will have a text input
                  parameters: [
                    {
                      name: "amount", // parameter name in the `href` above
                      label: "Enter the amount of SOL to donate", // placeholder of the text input
                      required: true,
                    },
                  ],
                },
              ]
            : []),
        ] as LinkedAction[],
      },
    };

    return { payload };
  } catch (err) {
    console.log(err);
    let message = "An unknown error occurred";
    if (typeof err == "string") message = err;
    return { error: message };
  }
};

export default getActionFromSearchParams;
