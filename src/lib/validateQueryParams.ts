import { PublicKey } from "@solana/web3.js";

const validatedQueryParams = (
  searchParams: URLSearchParams
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

  const toParam = searchParams.get("to");
  const amount1Param = searchParams.get("amount1");
  const amount2Param = searchParams.get("amount2");
  const amount3Param = searchParams.get("amount3");
  const freeAmountEnabledParam = searchParams.get("freeAmountEnabled");
  const feeParam = searchParams.get("fee");
  const redirectParam = searchParams.get("redirect");
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

export default validatedQueryParams;
