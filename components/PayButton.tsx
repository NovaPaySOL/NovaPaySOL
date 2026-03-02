"use client";

import React, { useMemo, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";

type Status =
  | "idle"
  | "sending"
  | "confirming"
  | "verifying"
  | "unlocked"
  | "error";

type Props = {
  onUnlocked?: (signature: string) => void;
};

export default function PayButton({ onUnlocked }: Props) {
  const { connection } = useConnection();
  const { publicKey, sendTransaction, connected } = useWallet();

  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [signature, setSignature] = useState<string | null>(null);

  const recipient = process.env.NEXT_PUBLIC_PAYMENT_RECIPIENT || "";
  const amountStr = process.env.NEXT_PUBLIC_PAYMENT_AMOUNT_SOL || "0.1";
  const network = process.env.NEXT_PUBLIC_SOLANA_NETWORK || "mainnet-beta";

  const amountSol = useMemo(() => {
    const n = Number(amountStr);
    return Number.isFinite(n) && n > 0 ? n : 0.1;
  }, [amountStr]);

  const disabled =
    !connected ||
    status === "sending" ||
    status === "confirming" ||
    status === "verifying" ||
    status === "unlocked";

  async function handlePay() {
    try {
      setError(null);
      setSignature(null);

      if (!connected || !publicKey) {
        throw new Error("Connect your wallet first.");
      }
      if (!recipient) {
        throw new Error("Missing NEXT_PUBLIC_PAYMENT_RECIPIENT");
      }

      const toPubkey = new PublicKey(recipient);
      const lamports = Math.round(amountSol * LAMPORTS_PER_SOL);

      setStatus("sending");

      const tx = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey,
          lamports,
        })
      );

      const latest = await connection.getLatestBlockhash("finalized");
      tx.recentBlockhash = latest.blockhash;
      tx.feePayer = publicKey;

      const sig = await sendTransaction(tx, connection);
      setSignature(sig);
      setStatus("confirming");

      const confirmation = await connection.confirmTransaction(
        { signature: sig, ...latest },
        "confirmed"
      );

      if (confirmation.value.err) {
        throw new Error("Transaction failed");
      }

      setStatus("verifying");

      const res = await fetch("/api/verify-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          signature: sig,
          expectedRecipient: recipient,
          expectedAmountSol: amountSol,
          network,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        throw new Error(data.reason || "Verification failed");
      }

      setStatus("unlocked");
      onUnlocked?.(sig);
    } catch (e: any) {
      setStatus("error");
      setError(e?.message || "Payment error");
    }
  }

  const label =
    status === "sending"
      ? "Sending..."
      : status === "confirming"
      ? "Confirming..."
      : status === "verifying"
      ? "Verifying..."
      : status === "unlocked"
      ? "Unlocked ✅"
      : `Pay ${amountSol} SOL`;

  return (
    <div style={{ display: "grid", gap: 10, maxWidth: 420 }}>
      <button
        onClick={handlePay}
        disabled={disabled}
        style={{
          padding: "14px",
          borderRadius: 12,
          fontWeight: 800,
          cursor: disabled ? "not-allowed" : "pointer",
          border: "1px solid rgba(0,0,0,0.2)",
          background: disabled ? "#eee" : "#fff",
        }}
      >
        {label}
      </button>

      {signature && (
        <div style={{ fontSize: 12, wordBreak: "break-all" }}>
          Tx: {signature}
        </div>
      )}

      {error && (
        <div style={{ fontSize: 12, color: "crimson" }}>
          {error}
        </div>
      )}
    </div>
  );
}
