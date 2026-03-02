"use client";

import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

export default function WalletButton() {
  return (
    <div style={{ display: "inline-flex" }}>
      <WalletMultiButton />
    </div>
  );
}
