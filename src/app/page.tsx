"use client";

import React, { useEffect, useMemo, useState } from "react";
import { WalletMultiButton } from "./wallet-ui";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

/* ---------------------------------- */
/* Utilities                           */
/* ---------------------------------- */
function cn(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

/* ---------------------------------- */
/* Brand                               */
/* ---------------------------------- */
const BRAND = {
  name: "NovaPay",
  tagline: "A Solana-native neobank built for real money movement",
};

/* ---------------------------------- */
/* Navigation                          */
/* ---------------------------------- */
const NAV = [
  { label: "Product", href: "#product" },
  { label: "Dashboard", href: "#dashboard" },
  { label: "Security", href: "#security" },
  { label: "FAQ", href: "#faq" },
];

/* ---------------------------------- */
/* Page                                */
/* ---------------------------------- */
export default function Page() {
  const gradient = useMemo(
    () =>
      "radial-gradient(1100px 520px at 18% 12%, rgba(255,138,0,.22) 0%, transparent 60%)," +
      "radial-gradient(980px 480px at 85% 28%, rgba(255,176,64,.14) 0%, transparent 55%)," +
      "radial-gradient(760px 480px at 55% 92%, rgba(255,255,255,.05) 0%, transparent 55%)",
    []
  );

  return (
    <main style={{ backgroundImage: gradient }} className="min-h-screen">
      <Header />
      <Hero />
      <Product />
      <Dashboard />
      <Security />
      <FAQ />
      <Footer />
    </main>
  );
}

/* ---------------------------------- */
/* Header                              */
/* ---------------------------------- */
function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-black/40 backdrop-blur">
      <div className="containerX flex h-16 items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="h-9 w-9 rounded-xl"
            style={{
              background:
                "linear-gradient(135deg, rgb(var(--accent)) 0%, rgb(var(--accent2)) 100%)",
            }}
          />
          <div className="leading-tight">
            <div className="text-sm font-bold">{BRAND.name}</div>
            <div className="muted text-xs">{BRAND.tagline}</div>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          {NAV.map((n) => (
            <a key={n.href} href={n.href} className="muted hover:text-white text-sm">
              {n.label}
            </a>
          ))}
        </nav>

        {/* Top-right actions */}
        <div className="flex items-center gap-2">
          <a
            href="https://x.com/NovaPaySOL"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btnGhost hidden sm:inline-flex"
          >
            Follow on X
          </a>

          <WalletMultiButton />
        </div>
      </div>
    </header>
  );
}

/* ---------------------------------- */
/* Hero                                */
/* ---------------------------------- */
function Hero() {
  return (
    <section className="containerX pt-16 md:pt-24 text-center">
      <div className="pill mx-auto w-fit">Solana • Neobank • Mainnet</div>

      <h1 className="mt-6 text-4xl md:text-6xl font-semibold tracking-tight">
        Banking infrastructure for the on-chain economy.
      </h1>

      <p className="muted mt-5 max-w-2xl mx-auto text-base md:text-lg">
        NovaPay combines wallet-first access, instant settlement, and institutional-grade controls
        into a single Solana-native financial platform.
      </p>

      <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
        <a href="#dashboard" className="btn btnPrimary">
          View account
        </a>
        <a href="#security" className="btn btnGhost">
          Security & trust
        </a>
      </div>
    </section>
  );
}

/* ---------------------------------- */
/* Product                             */
/* ---------------------------------- */
function Product() {
  const items = [
    {
      title: "Instant settlement",
      body: "All balances settle directly on Solana, enabling near-instant finality and global access without intermediaries.",
    },
    {
      title: "Wallet-native access",
      body: "Users authenticate with industry-standard Solana wallets. NovaPay never takes custody of private keys.",
    },
    {
      title: "Financial controls",
      body: "Policy-driven limits, account visibility, and auditability designed to meet real operational requirements.",
    },
  ];

  return (
    <section id="product" className="containerX mt-20">
      <SectionTitle
        eyebrow="Product"
        title="Built like real financial infrastructure"
        subtitle="NovaPay is designed to feel familiar to users while meeting the expectations of modern financial platforms."
      />

      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {items.map((i) => (
          <div key={i.title} className="card p-6">
            <div className="font-semibold">{i.title}</div>
            <p className="muted mt-2 text-sm leading-relaxed">{i.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------------------------------- */
/* Dashboard (LIVE SOL BALANCE)        */
/* ---------------------------------- */
function Dashboard() {
  const { connection } = useConnection();
  const { publicKey, connected } = useWallet();
  const [sol, setSol] = useState<number | null>(null);
  const [tab, setTab] = useState<"overview" | "activity">("overview");

  useEffect(() => {
    let alive = true;

    async function fetchBalance() {
      if (!publicKey) {
        if (alive) setSol(null);
        return;
      }
      try {
        const lamports = await connection.getBalance(publicKey);
        if (alive) setSol(lamports / LAMPORTS_PER_SOL);
      } catch {
        if (alive) setSol(null);
      }
    }

    fetchBalance();
    const id = setInterval(fetchBalance, 15000);

    return () => {
      alive = false;
      clearInterval(id);
    };
  }, [connection, publicKey]);

  return (
    <section id="dashboard" className="containerX mt-24">
      <SectionTitle
        eyebrow="Dashboard"
        title="Your NovaPay account"
        subtitle="Real-time, read-only account data sourced directly from Solana Mainnet."
      />

      <div className="mt-8 card p-6">
        {!connected ? (
          <p className="muted text-sm">
            Connect your wallet to view your NovaPay account overview.
          </p>
        ) : (
          <>
            <div className="flex gap-4 border-b border-white/10 pb-3 mb-6">
              <button
                onClick={() => setTab("overview")}
                className={cn("text-sm", tab === "overview" && "text-white font-semibold")}
              >
                Overview
              </button>
              <button
                onClick={() => setTab("activity")}
                className={cn("text-sm", tab === "activity" && "text-white font-semibold")}
              >
                Activity
              </button>
            </div>

            {tab === "overview" && (
              <div className="grid gap-4 md:grid-cols-3">
                <div className="card p-5">
                  <div className="muted text-xs">SOL balance</div>
                  <div className="mt-1 text-2xl font-semibold">
                    {sol === null ? "Loading…" : sol.toFixed(4)} SOL
                  </div>
                </div>

                <div className="card p-5">
                  <div className="muted text-xs">Network</div>
                  <div className="mt-1 text-lg font-semibold">Solana Mainnet</div>
                </div>

                <div className="card p-5">
                  <div className="muted text-xs">Account status</div>
                  <div className="mt-1 text-lg font-semibold">Active</div>
                </div>
              </div>
            )}

            {tab === "activity" && (
              <div className="muted text-sm">
                Activity details will populate here as additional NovaPay features are enabled.
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}

/* ---------------------------------- */
/* Security                            */
/* ---------------------------------- */
function Security() {
  return (
    <section id="security" className="containerX mt-24">
      <SectionTitle
        eyebrow="Security"
        title="Designed for trust and transparency"
        subtitle="NovaPay is non-custodial by default and designed with security-first principles."
      />

      <div className="mt-10 grid gap-4 md:grid-cols-2">
        <div className="card p-6">
          <div className="font-semibold">Non-custodial architecture</div>
          <p className="muted mt-2 text-sm">
            Users maintain full control of their funds. NovaPay never accesses private keys.
          </p>
        </div>
        <div className="card p-6">
          <div className="font-semibold">On-chain verification</div>
          <p className="muted mt-2 text-sm">
            Account balances and activity are verifiable directly on Solana.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------- */
/* FAQ                                 */
/* ---------------------------------- */
function FAQ() {
  const items = [
    {
      q: "Is NovaPay live?",
      a: "NovaPay is live as a Mainnet-connected platform. Additional financial features are introduced progressively.",
    },
    {
      q: "Does NovaPay hold my funds?",
      a: "No. NovaPay is non-custodial. Funds remain in your connected Solana wallet.",
    },
    {
      q: "Is this a bank?",
      a: "NovaPay is a neobank-style financial platform built on blockchain infrastructure.",
    },
  ];

  return (
    <section id="faq" className="containerX mt-24">
      <SectionTitle
        eyebrow="FAQ"
        title="Frequently asked questions"
        subtitle="Clear answers about how NovaPay works."
      />

      <div className="mt-10 grid gap-4 md:grid-cols-2">
        {items.map((i) => (
          <div key={i.q} className="card p-5">
            <div className="font-semibold">{i.q}</div>
            <p className="muted mt-2 text-sm">{i.a}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------------------------------- */
/* Footer                              */
/* ---------------------------------- */
function Footer() {
  return (
    <section className="containerX mt-24 pb-16">
      <div className="card p-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="muted text-sm">
          © {new Date().getFullYear()} NovaPay. All rights reserved.
        </div>
        <div className="flex gap-4 text-sm muted">
          <a href="#">Privacy</a>
          <a href="#">Security</a>
          <a href="#">Status</a>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------- */
/* Shared                              */
/* ---------------------------------- */
function SectionTitle({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="max-w-3xl mx-auto text-center">
      <div className="pill mx-auto w-fit">{eyebrow}</div>
      <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
      <p className="muted mt-3 text-base md:text-lg">{subtitle}</p>
    </div>
  );
}
