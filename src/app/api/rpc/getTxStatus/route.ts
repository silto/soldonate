import { getRequestContext } from "@cloudflare/next-on-pages";
import { Connection } from "@solana/web3.js";

export const runtime = "edge";

export const OPTIONS = async () => {
  const env = getRequestContext().env;
  const RPC_HEADERS = {
    "Access-Control-Allow-Origin": env.NEXT_PUBLIC_BASE_URL,
    "Access-Control-Allow-Methods": "POST,OPTION",
    "Access-Control-Allow-Headers":
      "Content-Type, Authorization, Content-Encoding, Accept-Encoding",
    "Content-Type": "application/json",
  };
  return Response.json(
    {},
    {
      headers: RPC_HEADERS,
    }
  );
};

export const POST = async (req: Request) => {
  const env = getRequestContext().env;
  const RPC_HEADERS = {
    "Access-Control-Allow-Origin": env.NEXT_PUBLIC_BASE_URL,
    "Access-Control-Allow-Methods": "POST,OPTION",
    "Access-Control-Allow-Headers":
      "Content-Type, Authorization, Content-Encoding, Accept-Encoding",
    "Content-Type": "application/json",
  };
  try {
    const body: { signature: string } = await req.json();
    if (!body?.signature) {
      throw "Invalid request";
    }
    const connection = new Connection(env.SOLANA_RPC!);

    const res = await connection.getSignatureStatus(body.signature);
    if (!res.value) {
      throw "Transaction not found";
    }

    return Response.json(res.value, {
      headers: RPC_HEADERS,
    });
  } catch (err) {
    let message = "An unknown error occurred";
    if (typeof err == "string") message = err;
    return Response.json(
      { message },
      {
        status: 400,
        headers: RPC_HEADERS,
      }
    );
  }
};
