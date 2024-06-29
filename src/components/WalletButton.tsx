"use client";

import dynamic from "next/dynamic";

const WalletButton = dynamic(
  async () =>
    (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false }
);

export default WalletButton;
