import {
  ActionPostResponse,
  ACTIONS_CORS_HEADERS,
  createPostResponse,
  ActionPostRequest,
} from "@solana/actions";
import {
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import { Decimal } from "decimal.js";
import { getRequestContext } from "@cloudflare/next-on-pages";

import validatePostParams from "@/lib/validatePostParams";
import getInfosFromURL from "@/lib/getInfosFromURL";
export const runtime = "edge";

export const GET = async (req: Request) => {
  const { payload, error } = await getInfosFromURL(
    new URL(req.url).searchParams
  );
  if (payload) {
    return Response.json(payload, {
      headers: ACTIONS_CORS_HEADERS,
    });
  }
  let message = error ?? "An unknown error occurred";
  return Response.json(
    { message },
    {
      status: 400,
      headers: ACTIONS_CORS_HEADERS,
    }
  );
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
    const { amount, fee, toPubkey } = validatePostParams(
      requestUrl.searchParams
    );

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
    let feeAmount = new Decimal(0);
    if (fee) {
      feeAmount = new Decimal(amount)
        .mul(new Decimal(fee))
        .mul(new Decimal(0.01))
        .mul(new Decimal(LAMPORTS_PER_SOL));
    }
    transaction.add(
      SystemProgram.transfer({
        fromPubkey: account,
        toPubkey: toPubkey,
        lamports: new Decimal(amount)
          .mul(LAMPORTS_PER_SOL)
          .sub(feeAmount)
          .toNumber(),
      })
    );
    if (fee) {
      transaction.add(
        SystemProgram.transfer({
          fromPubkey: account,
          toPubkey: new PublicKey(env.FEE_ADDRESS!),
          lamports: feeAmount.toNumber(),
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
