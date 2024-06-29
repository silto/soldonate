import { PublicKey } from "@solana/web3.js";

const validatePostParams = (
  searchParams: URLSearchParams
): {
  toPubkey: PublicKey;
  amount: number;
  fee: number;
} => {
  let toPubkey: PublicKey;
  let amount: number;
  let fee: number;
  const toParam = searchParams.get("to");
  const amountParam = searchParams.get("amount");
  const feeParam = searchParams.get("fee");
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

export default validatePostParams;
