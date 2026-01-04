"use client";

import dynamic from "next/dynamic";
import "@solana/wallet-adapter-react-ui/styles.css";

export const WalletMultiButton = dynamic(
  async () => (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false }
);
