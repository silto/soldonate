/**
 * Solana Actions Example
 */

import {
  ActionPostResponse,
  ACTIONS_CORS_HEADERS,
  createPostResponse,
  ActionGetResponse,
  ActionPostRequest,
  LinkedAction,
} from "@solana/actions";
import {
  Authorized,
  clusterApiUrl,
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  StakeProgram,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import { Decimal } from "decimal.js";
import { getRequestContext } from "@cloudflare/next-on-pages";
import * as cheerio from "cheerio";
export const runtime = "edge";

export const GET = async (req: Request) => {
  try {
    const requestUrl = new URL(req.url);
    const {
      toPubkey,
      amount1,
      amount2,
      amount3,
      freeAmountEnabled,
      fee,
      redirect,
    } = validatedQueryParams(requestUrl);

    let iconUrl = new URL("/solana_devs.jpg", requestUrl.origin).toString();
    if (redirect) {
      try {
        const response = await fetch(redirect);
        const html = await response.text();
        const $ = cheerio.load(html);
        const twitterImage = $('meta[name="twitter:image"]').attr("content");
        const ogImage = $('meta[property="og:image"]').attr("content");
        if (twitterImage) {
          iconUrl = twitterImage;
        } else if (ogImage) {
          iconUrl = ogImage;
        }
      } catch (error) {
        console.log(error);
      }
    }

    const baseHref = new URL(
      `/api/actions/donate?to=${toPubkey.toBase58()}${
        fee ? `&fee=${fee}` : ""
      }`,
      requestUrl.origin
    ).toString();

    const payload: ActionGetResponse = {
      title: "Donate SOL",
      icon: iconUrl,
      description: "Make a donation",
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
                  label: "Donate SOL", // button text
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

    return Response.json(payload, {
      headers: ACTIONS_CORS_HEADERS,
    });
  } catch (err) {
    console.log(err);
    let message = "An unknown error occurred";
    if (typeof err == "string") message = err;
    return Response.json(
      { message },
      {
        status: 400,
        headers: ACTIONS_CORS_HEADERS,
      }
    );
  }
};

// DO NOT FORGET TO INCLUDE THE `OPTIONS` HTTP METHOD
// THIS WILL ENSURE CORS WORKS FOR BLINKS
export const OPTIONS = async () => {
  return Response.json(
    {},
    {
      headers: ACTIONS_CORS_HEADERS,
    }
  );
};

export const POST = async (req: Request) => {
  try {
    const env = getRequestContext().env;
    const requestUrl = new URL(req.url);
    const { amount, fee, toPubkey } = validatePostParams(requestUrl);

    const body: ActionPostRequest = await req.json();

    // validate the client provided input
    let account: PublicKey;
    try {
      account = new PublicKey(body.account);
    } catch (err) {
      return new Response('Invalid "account" provided', {
        status: 400,
        headers: ACTIONS_CORS_HEADERS,
      });
    }

    const connection = new Connection(env.SOLANA_RPC!);

    // ensure the receiving account will be rent exempt
    const minimumBalance = await connection.getMinimumBalanceForRentExemption(
      0 // note: simple accounts that just store native SOL have `0` bytes of data
    );
    if (new Decimal(amount).mul(LAMPORTS_PER_SOL).toNumber() < minimumBalance) {
      throw `account may not be rent exempt: ${toPubkey.toBase58()}`;
    }

    const transaction = new Transaction();
    transaction.feePayer = account;

    transaction.add(
      SystemProgram.transfer({
        fromPubkey: account,
        toPubkey: toPubkey,
        lamports: new Decimal(amount).mul(LAMPORTS_PER_SOL).toNumber(),
      })
    );
    if (fee) {
      transaction.add(
        SystemProgram.transfer({
          fromPubkey: account,
          toPubkey: new PublicKey(env.FEE_ADDRESS!),
          lamports: new Decimal(amount)
            .mul(new Decimal(fee))
            .mul(new Decimal(0.01))
            .mul(new Decimal(LAMPORTS_PER_SOL))
            .toNumber(),
        })
      );
    }

    // set the end user as the fee payer
    transaction.feePayer = account;

    transaction.recentBlockhash = (
      await connection.getLatestBlockhash()
    ).blockhash;

    const payload: ActionPostResponse = await createPostResponse({
      fields: {
        transaction,
        message: `Donate ${amount} SOL to ${toPubkey.toBase58()}`,
      },
      // note: no additional signers are needed
      // signers: [],
    });
    console.log("PAYLOAD");

    console.log(payload);

    return Response.json(payload, {
      headers: ACTIONS_CORS_HEADERS,
    });
  } catch (err) {
    console.log("ERROR LOG");

    console.log(err);
    let message = "An unknown error occurred";
    if (typeof err == "string") message = err;
    return Response.json(
      { message },
      {
        status: 400,
        headers: ACTIONS_CORS_HEADERS,
      }
    );
  }
};

const validatePostParams = (
  requestUrl: URL
): {
  toPubkey: PublicKey;
  amount: number;
  fee: number;
} => {
  let toPubkey: PublicKey;
  let amount: number;
  let fee: number;
  const toParam = requestUrl.searchParams.get("to");
  const amountParam = requestUrl.searchParams.get("amount");
  const feeParam = requestUrl.searchParams.get("fee");
  if (toParam) {
    try {
      toPubkey = new PublicKey(toParam);
    } catch (error) {
      throw "Invalid input query parameter: to";
    }
  } else {
    throw "missing query parameter: to";
  }

  if (amountParam) {
    try {
      amount = parseFloat(amountParam);
    } catch (error) {
      throw "Invalid input query parameter: amount";
    }
    if (amount <= 0) throw "amount is too small";
  } else {
    throw "missing query parameter: amount";
  }

  if (feeParam) {
    try {
      fee = parseFloat(feeParam);
    } catch (error) {
      throw "Invalid input query parameter: fee";
    }
    if (fee < 0) throw "fee is too small";
  } else {
    fee = 0;
  }

  return {
    toPubkey,
    amount,
    fee,
  };
};

const validatedQueryParams = (
  requestUrl: URL
): {
  toPubkey: PublicKey;
  amount1: number | null;
  amount2: number | null;
  amount3: number | null;
  freeAmountEnabled: boolean;
  fee: number | null;
  redirect: string | null;
} => {
  let toPubkey: PublicKey;
  let amount1: number | null = null;
  let amount2: number | null = null;
  let amount3: number | null = null;
  let freeAmountEnabled: boolean = false;
  let fee: number | null = null;
  let redirect: string | null = null;

  const toParam = requestUrl.searchParams.get("to");
  const amount1Param = requestUrl.searchParams.get("amount1");
  const amount2Param = requestUrl.searchParams.get("amount2");
  const amount3Param = requestUrl.searchParams.get("amount3");
  const freeAmountEnabledParam =
    requestUrl.searchParams.get("freeAmountEnabled");
  const feeParam = requestUrl.searchParams.get("fee");
  const redirectParam = requestUrl.searchParams.get("redirect");
  if (toParam) {
    try {
      toPubkey = new PublicKey(toParam);
    } catch (error) {
      throw "Invalid input query parameter: to";
    }
  } else {
    throw "missing query parameter: to";
  }

  if (amount1Param) {
    try {
      amount1 = parseFloat(amount1Param);
    } catch (error) {
      throw "Invalid input query parameter: amount1";
    }
    if (amount1 <= 0) throw "amount1 is too small";
  }

  if (amount2Param) {
    try {
      amount2 = parseFloat(amount2Param);
    } catch (error) {
      throw "Invalid input query parameter: amount2";
    }
    if (amount2 <= 0) throw "amount2 is too small";
  }

  if (amount3Param) {
    try {
      amount3 = parseFloat(amount3Param);
    } catch (error) {
      throw "Invalid input query parameter: amount3";
    }
    if (amount3 <= 0) throw "amount3 is too small";
  }

  if (freeAmountEnabledParam) {
    if (freeAmountEnabledParam !== "0" && freeAmountEnabledParam !== "1")
      throw "Invalid input query parameter: freeAmountEnabled";
    if (freeAmountEnabledParam === "1") {
      freeAmountEnabled = true;
    }
  }
  if (!amount1 && !amount2 && !amount3 && !freeAmountEnabled) {
    throw "At least one amount or freeAmountEnabled is necessary";
  }
  if (feeParam) {
    try {
      fee = parseFloat(feeParam);
    } catch (error) {
      throw "Invalid input query parameter: fee";
    }
    if (fee < 0) throw "fee is too small";
  }

  if (redirectParam) {
    try {
      new URL(redirectParam);
    } catch (error) {
      throw "Invalid input query parameter: redirect";
    }
    redirect = redirectParam;
  }

  return {
    toPubkey,
    amount1,
    amount2,
    amount3,
    freeAmountEnabled,
    fee,
    redirect,
  };
};
