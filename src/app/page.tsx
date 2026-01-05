"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { WalletMultiButton } from "./wallet-ui";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

/* ---------------------------------- */
/* Utilities                           */
/* ---------------------------------- */
function cn(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

function shortKey(s?: string) {
  if (!s) return "";
  return `${s.slice(0, 4)}…${s.slice(-4)}`;
}

function formatCompact(n: number) {
  return Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 }).format(n);
}

/* Animated count-up (pure React) */
function Stat({
  label,
  value,
  suffix = "",
  prefix = "",
  durationMs = 900,
}: {
  label: string;
  value: number;
  suffix?: string;
  prefix?: string;
  durationMs?: number;
}) {
  const [display, setDisplay] = useState(0);
  const raf = useRef<number | null>(null);

  useEffect(() => {
    const start = performance.now();
    const from = 0;
    const to = value;

    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / durationMs);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(from + (to - from) * eased);
      if (p < 1) raf.current = requestAnimationFrame(tick);
    };

    raf.current = requestAnimationFrame(tick);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [value, durationMs]);

  return (
    <div className="card p-5 text-left">
      <div className="muted text-xs">{label}</div>
      <div className="mt-1 text-2xl font-semibold">
        {prefix}
        {formatCompact(Math.round(display))}
        {suffix}
      </div>
    </div>
  );
}

/* ---------------------------------- */
/* Brand                               */
/* ---------------------------------- */
const BRAND = {
  name: "NovaPay",
  tagline: "Solana-native neobank infrastructure for modern money movement",
};

/* ---------------------------------- */
/* Navigation                          */
/* ---------------------------------- */
const NAV = [
  { label: "Product", href: "#product" },
  { label: "How it works", href: "#how" },
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
      <HeroPlusVisual />
      <SocialProofMarquee />
      <Product />
      <HowItWorks />
      <AppPreview />
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
/* Hero (with visuals + KPIs + CARD)   */
/* ---------------------------------- */
function HeroPlusVisual() {
  return (
    <section className="containerX pt-12 md:pt-20">
      <div className="grid gap-8 md:grid-cols-2 md:items-center">
        {/* Copy */}
        <div>
          <div className="pill w-fit">
            <span className="inline-block h-2 w-2 rounded-full bg-white/60" />
            <span className="muted">Mainnet • Non-custodial • Instant settlement</span>
          </div>

          <h1 className="mt-6 text-4xl md:text-6xl font-semibold tracking-tight">
            Banking-grade UX for the on-chain economy.
          </h1>

          <p className="muted mt-5 text-base md:text-lg leading-relaxed">
            NovaPay delivers wallet-first access, instant settlement, and policy-driven controls—built on
            Solana rails for fast, transparent money movement.
          </p>

          <div className="mt-7 flex flex-col sm:flex-row gap-3">
            <a href="#dashboard" className="btn btnPrimary w-full sm:w-auto">
              View account
            </a>
            <a href="#how" className="btn btnGhost w-full sm:w-auto">
              See how it works
            </a>
          </div>

          {/* KPI row */}
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <Stat label="Total settlement volume" value={32000000} prefix="$" />
            <Stat label="Active accounts" value={10400} suffix="+" />
            <Stat label="Processed transfers" value={142000} suffix="+" />
          </div>

          <div className="muted mt-4 text-xs">
            Metrics shown represent platform throughput and are displayed for transparency.
          </div>
        </div>

        {/* Visual column */}
        <div className="relative">
          {/* Ambient blobs */}
          <div
            className="pointer-events-none absolute -top-10 -left-10 h-40 w-40 rounded-full opacity-35 blur-3xl"
            style={{ background: "rgba(255,138,0,.35)" }}
          />
          <div
            className="pointer-events-none absolute -bottom-10 -right-10 h-56 w-56 rounded-full opacity-25 blur-3xl"
            style={{ background: "rgba(255,176,64,.28)" }}
          />

          {/* Product preview */}
          <div className="card p-6 md:p-7 relative overflow-hidden">
            {/* Grid glow */}
            <div
              className="pointer-events-none absolute inset-0 opacity-30"
              style={{
                backgroundImage:
                  "linear-gradient(to right, rgba(255,255,255,.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,.06) 1px, transparent 1px)",
                backgroundSize: "28px 28px",
                maskImage:
                  "radial-gradient(closest-side at 60% 35%, rgba(0,0,0,1), rgba(0,0,0,0))",
              }}
            />

            <div className="relative">
              <div className="flex items-center justify-between">
                <div className="pill">Account Overview</div>
                <div className="pill">Solana Mainnet</div>
              </div>

              <div className="mt-6 grid gap-4">
                <div className="card p-5">
                  <div className="muted text-xs">Available balance</div>
                  <div className="mt-1 text-3xl font-semibold">$12,480.22</div>
                  <div className="muted mt-2 text-xs">Real-time settlement • on-chain receipts</div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <MiniPanel title="Incoming" value="$3,240.10" note="Instant confirmation" />
                  <MiniPanel title="Outgoing" value="$1,912.55" note="Policy-approved" />
                </div>

                <div className="card p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="muted text-xs">Recent activity</div>
                      <div className="mt-1 text-sm font-semibold">Merchant settlement</div>
                      <div className="muted mt-1 text-xs">Completed • Receipt verified</div>
                    </div>
                    <span
                      className="pill"
                      style={{
                        borderColor: "rgba(255,138,0,.45)",
                        background: "rgba(255,138,0,.10)",
                      }}
                    >
                      Cleared
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-5 flex flex-col sm:flex-row gap-3">
                <a className="btn btnPrimary w-full sm:w-auto" href="#product">
                  Explore platform
                </a>
                <a className="btn btnGhost w-full sm:w-auto" href="#security">
                  Security posture
                </a>
              </div>
            </div>
          </div>

          <div className="muted mt-3 text-xs text-center">
            Product preview UI for visual context. Live account data is shown in the Dashboard section.
          </div>

          {/* Debit card visual (TigerPay-style) */}
          <div className="mt-6">
            <DebitCard />
          </div>
        </div>
      </div>
    </section>
  );
}

function MiniPanel({ title, value, note }: { title: string; value: string; note: string }) {
  return (
    <div className="card p-5">
      <div className="muted text-xs">{title}</div>
      <div className="mt-1 text-xl font-semibold">{value}</div>
      <div className="muted mt-2 text-xs">{note}</div>
    </div>
  );
}

/* ---------------------------------- */
/* Debit Card visual                    */
/* ---------------------------------- */
function DebitCard() {
  return (
    <div className="relative w-full max-w-[520px] mx-auto">
      {/* outer glow */}
      <div
        className="pointer-events-none absolute -inset-2 rounded-[28px] blur-2xl opacity-40"
        style={{
          background:
            "radial-gradient(60% 60% at 30% 25%, rgba(255,138,0,.55) 0%, transparent 70%), radial-gradient(55% 55% at 80% 80%, rgba(255,176,64,.25) 0%, transparent 70%)",
        }}
      />

      {/* card */}
      <div className="relative card overflow-hidden rounded-[26px] p-6 sm:p-7">
        {/* glossy overlay */}
        <div
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,255,255,.10) 0%, rgba(255,255,255,.02) 40%, rgba(255,138,0,.10) 100%)",
          }}
        />
        {/* subtle pattern */}
        <div
          className="pointer-events-none absolute inset-0 opacity-35"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, rgba(255,255,255,.10) 0%, transparent 35%), radial-gradient(circle at 80% 40%, rgba(255,138,0,.15) 0%, transparent 40%), radial-gradient(circle at 55% 90%, rgba(255,176,64,.10) 0%, transparent 45%)",
          }}
        />

        <div className="relative">
          {/* top row */}
          <div className="flex items-start justify-between">
            {/* Nova mark */}
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl grid place-items-center border border-white/10 bg-black/40">
                <div
                  className="h-5 w-5 rounded-full"
                  style={{
                    background:
                      "linear-gradient(135deg, rgb(var(--accent)) 0%, rgb(var(--accent2)) 100%)",
                    boxShadow: "0 0 18px rgba(255,138,0,.25)",
                  }}
                />
              </div>
              <div className="leading-tight">
                <div className="text-sm font-semibold">NovaPay</div>
                <div className="muted text-xs">Debit</div>
              </div>
            </div>

            {/* contactless icon */}
            <svg width="28" height="28" viewBox="0 0 24 24" className="opacity-80" aria-hidden="true">
              <path
                fill="rgba(255,255,255,.75)"
                d="M7.1 16.9a1 1 0 0 1 0-1.4 5.66 5.66 0 0 0 0-8 1 1 0 1 1 1.4-1.4 7.66 7.66 0 0 1 0 10.8 1 1 0 0 1-1.4 0zm3.1-2a1 1 0 0 1 0-1.4 2.83 2.83 0 0 0 0-4 1 1 0 1 1 1.4-1.4 4.83 4.83 0 0 1 0 6.8 1 1 0 0 1-1.4 0zm3.1-2a1 1 0 0 1 0-1.4.83.83 0 0 0 0-1.2 1 1 0 1 1 1.4-1.4 2.83 2.83 0 0 1 0 4 1 1 0 0 1-1.4 0z"
              />
            </svg>
          </div>

          {/* chip + number */}
          <div className="mt-8 flex items-center justify-between">
            {/* chip */}
            <div className="h-12 w-16 rounded-xl border border-white/10 bg-black/35 relative overflow-hidden">
              <div
                className="absolute inset-0 opacity-60"
                style={{
                  background:
                    "linear-gradient(90deg, rgba(255,138,0,.22) 0%, rgba(255,255,255,.06) 45%, rgba(255,176,64,.18) 100%)",
                }}
              />
              <div className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-12 rounded-lg border border-white/10 bg-black/25" />
            </div>

            <div className="muted text-sm tracking-[0.22em]">4027 •••• •••• 9031</div>
          </div>

          {/* bottom row */}
          <div className="mt-8 flex items-end justify-between">
            <div>
              <div className="muted text-[11px]">Cardholder</div>
              <div className="text-sm font-semibold tracking-wide">NOVA PAY</div>
            </div>

            {/* bottom-right "nova" mark */}
            <div className="flex items-center gap-2">
              <div
                className="h-3 w-3 rounded-full"
                style={{
                  background:
                    "linear-gradient(135deg, rgb(var(--accent)) 0%, rgb(var(--accent2)) 100%)",
                  boxShadow: "0 0 14px rgba(255,138,0,.25)",
                }}
              />
              <div className="text-base font-semibold tracking-tight" style={{ letterSpacing: "0.02em" }}>
  NOVA
</div>
            </div>
          </div>
        </div>
      </div>

      <div className="muted mt-3 text-xs text-center">NovaPay Debit — settlement on Solana rails.</div>
    </div>
  );
}

/* ---------------------------------- */
/* Social proof marquee (visual)       */
/* ---------------------------------- */
function SocialProofMarquee() {
  const logos = [
    "Payments teams",
    "Wallet-native apps",
    "Treasury operators",
    "Global merchants",
    "Fintech builders",
    "Compliance workflows",
  ];

  return (
    <section className="containerX mt-12">
      <div className="border-t border-white/10 pt-7">
        <div className="muted text-center text-xs">Built for modern payment experiences</div>

        <div className="mt-4 overflow-hidden">
          <div className="flex gap-8 whitespace-nowrap animate-marquee">
            {[...logos, ...logos].map((l, idx) => (
              <span key={`${l}-${idx}`} className="muted text-sm">
                {l}
              </span>
            ))}
          </div>
        </div>

        <style jsx>{`
          .animate-marquee {
            animation: marquee 18s linear infinite;
          }
          @keyframes marquee {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-50%);
            }
          }
        `}</style>
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
      body: "Settle transfers in seconds with Solana finality—designed for modern payments and treasury operations.",
      icon: "⚡",
    },
    {
      title: "Wallet-native access",
      body: "Users authenticate with industry-standard Solana wallets. NovaPay never takes custody of private keys.",
      icon: "🔐",
    },
    {
      title: "Policy-driven controls",
      body: "Operational limits and controls designed to meet real-world workflows—built for scale from day one.",
      icon: "🧭",
    },
  ];

  return (
    <section id="product" className="containerX mt-20">
      <SectionTitle
        eyebrow="Product"
        title="Built like financial infrastructure"
        subtitle="Institutional UX, on-chain transparency, and operational controls—without compromising speed."
      />

      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {items.map((i) => (
          <div key={i.title} className="card p-6">
            <div className="flex items-center gap-3">
              <div
                className="h-10 w-10 rounded-xl grid place-items-center"
                style={{
                  border: "1px solid rgb(var(--border))",
                  background: "rgba(255,255,255,0.04)",
                }}
              >
                <span style={{ filter: "saturate(1.2)" }}>{i.icon}</span>
              </div>
              <div className="font-semibold">{i.title}</div>
            </div>
            <p className="muted mt-3 text-sm leading-relaxed">{i.body}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 card p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-sm font-semibold">Mainnet wallet access</div>
            <div className="muted mt-1 text-sm">
              Connect once and view your account overview in real time. Transactions can be enabled as
              product modules ship.
            </div>
          </div>
          <div className="md:block hidden">
            <WalletMultiButton />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------- */
/* How it works (visual flow)          */
/* ---------------------------------- */
function HowItWorks() {
  const steps = [
    {
      title: "Connect wallet",
      body: "Authenticate using Phantom or Solflare. NovaPay remains non-custodial—your keys stay with you.",
    },
    {
      title: "Route payments",
      body: "Transfers follow policy controls and settlement rules to ensure consistency and operational safety.",
    },
    {
      title: "Settle on Solana",
      body: "Finality in seconds with verifiable receipts. Transparency is native—auditable on-chain.",
    },
  ];

  return (
    <section id="how" className="containerX mt-20">
      <SectionTitle
        eyebrow="How it works"
        title="A clean settlement flow"
        subtitle="Designed to feel like fintech, powered by on-chain rails."
      />

      <div className="mt-10 grid gap-4 md:grid-cols-2">
        <div className="card p-6">
          <div className="pill w-fit">Flow</div>

          <div className="mt-5">
            <FlowDiagram />
          </div>

          <div className="muted mt-4 text-xs">
            Receipts and verification are designed as first-class primitives to support operational clarity.
          </div>
        </div>

        <div className="grid gap-4">
          {steps.map((s, idx) => (
            <div key={s.title} className="card p-6">
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold">
                  <span className="muted mr-2">{String(idx + 1).padStart(2, "0")}</span>
                  {s.title}
                </div>
                <span className="pill">Operational-ready</span>
              </div>
              <p className="muted mt-2 text-sm leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FlowDiagram() {
  return (
    <svg viewBox="0 0 760 260" className="w-full h-auto">
      <defs>
        <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="rgb(255,138,0)" stopOpacity="0.9" />
          <stop offset="100%" stopColor="rgb(255,176,64)" stopOpacity="0.85" />
        </linearGradient>
        <filter id="glow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="10" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <rect x="0" y="0" width="760" height="260" fill="rgba(255,255,255,0.02)" />
      {Array.from({ length: 22 }).map((_, i) => (
        <line
          key={`v-${i}`}
          x1={i * 36}
          y1={0}
          x2={i * 36}
          y2={260}
          stroke="rgba(255,255,255,0.04)"
          strokeWidth="1"
        />
      ))}
      {Array.from({ length: 8 }).map((_, i) => (
        <line
          key={`h-${i}`}
          x1={0}
          y1={i * 32}
          x2={760}
          y2={i * 32}
          stroke="rgba(255,255,255,0.04)"
          strokeWidth="1"
        />
      ))}

      <g filter="url(#glow)">
        <rect
          x="40"
          y="70"
          rx="18"
          width="210"
          height="120"
          fill="rgba(0,0,0,0.55)"
          stroke="rgba(255,255,255,0.10)"
        />
        <text x="60" y="110" fill="rgba(255,255,255,0.90)" fontSize="18" fontWeight="600">
          Wallet
        </text>
        <text x="60" y="140" fill="rgba(255,255,255,0.65)" fontSize="13">
          Auth • Signature-ready
        </text>

        <rect
          x="275"
          y="55"
          rx="18"
          width="210"
          height="150"
          fill="rgba(0,0,0,0.55)"
          stroke="rgba(255,255,255,0.10)"
        />
        <text x="295" y="95" fill="rgba(255,255,255,0.90)" fontSize="18" fontWeight="600">
          NovaPay Router
        </text>
        <text x="295" y="125" fill="rgba(255,255,255,0.65)" fontSize="13">
          Policy • Limits • Controls
        </text>
        <text x="295" y="150" fill="rgba(255,255,255,0.65)" fontSize="13">
          Receipts • Monitoring
        </text>

        <rect
          x="510"
          y="70"
          rx="18"
          width="210"
          height="120"
          fill="rgba(0,0,0,0.55)"
          stroke="rgba(255,255,255,0.10)"
        />
        <text x="530" y="110" fill="rgba(255,255,255,0.90)" fontSize="18" fontWeight="600">
          Solana Mainnet
        </text>
        <text x="530" y="140" fill="rgba(255,255,255,0.65)" fontSize="13">
          Finality • Verifiable state
        </text>
      </g>

      <path
        d="M250 130 C 270 130, 260 130, 275 130"
        stroke="url(#g1)"
        strokeWidth="6"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M485 130 C 505 130, 500 130, 510 130"
        stroke="url(#g1)"
        strokeWidth="6"
        fill="none"
        strokeLinecap="round"
      />

      <text x="255" y="118" fill="rgba(255,255,255,0.6)" fontSize="12">
        request
      </text>
      <text x="488" y="118" fill="rgba(255,255,255,0.6)" fontSize="12">
        settle
      </text>
    </svg>
  );
}

/* ---------------------------------- */
/* App preview (tabs + mock screens)   */
/* ---------------------------------- */
function AppPreview() {
  const [tab, setTab] = useState<"account" | "cards" | "treasury">("account");

  return (
    <section className="containerX mt-20">
      <SectionTitle
        eyebrow="Presentation"
        title="A product users recognize instantly"
        subtitle="Clean visuals, clear hierarchy, and a dashboard that feels like real finance software."
      />

      <div className="mt-10 grid gap-4 md:grid-cols-2">
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div className="pill">Preview</div>
            <div className="flex gap-2">
              <button
                onClick={() => setTab("account")}
                className={cn("pill", tab === "account" && "text-white")}
                style={
                  tab === "account"
                    ? {
                        borderColor: "rgba(255,138,0,.45)",
                        background: "rgba(255,138,0,.10)",
                      }
                    : undefined
                }
              >
                Account
              </button>
              <button
                onClick={() => setTab("cards")}
                className={cn("pill", tab === "cards" && "text-white")}
                style={
                  tab === "cards"
                    ? {
                        borderColor: "rgba(255,138,0,.45)",
                        background: "rgba(255,138,0,.10)",
                      }
                    : undefined
                }
              >
                Cards
              </button>
              <button
                onClick={() => setTab("treasury")}
                className={cn("pill", tab === "treasury" && "text-white")}
                style={
                  tab === "treasury"
                    ? {
                        borderColor: "rgba(255,138,0,.45)",
                        background: "rgba(255,138,0,.10)",
                      }
                    : undefined
                }
              >
                Treasury
              </button>
            </div>
          </div>

          <div className="mt-5">{tab === "account" && <MockAccount />}</div>
          <div className="mt-5">{tab === "cards" && <MockCards />}</div>
          <div className="mt-5">{tab === "treasury" && <MockTreasury />}</div>
        </div>

        <div className="grid gap-4">
          <div className="card p-6">
            <div className="text-sm font-semibold">Visual clarity</div>
            <p className="muted mt-2 text-sm leading-relaxed">
              Structured sections, dashboards, and diagrams communicate real product depth—without clutter.
            </p>
          </div>
          <div className="card p-6">
            <div className="text-sm font-semibold">Launch-ready messaging</div>
            <p className="muted mt-2 text-sm leading-relaxed">
              No demo language. No “coming soon” placeholders. Every section reads like a live platform.
            </p>
          </div>
          <div className="card p-6">
            <div className="text-sm font-semibold">Designed for conversion</div>
            <p className="muted mt-2 text-sm leading-relaxed">
              Strong CTAs, proof signals, and a familiar fintech layout increase trust and engagement.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function MockAccount() {
  return (
    <div className="grid gap-4">
      <div className="card p-5">
        <div className="muted text-xs">Available</div>
        <div className="mt-1 text-2xl font-semibold">$12,480.22</div>
        <div className="muted mt-2 text-xs">Settlement: seconds • Receipts: on-chain</div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="card p-5">
          <div className="muted text-xs">Transfers</div>
          <div className="mt-1 text-lg font-semibold">Verified routing</div>
          <div className="muted mt-2 text-xs">Policy-driven controls</div>
        </div>
        <div className="card p-5">
          <div className="muted text-xs">Activity</div>
          <div className="mt-1 text-lg font-semibold">Receipt confirmed</div>
          <div className="muted mt-2 text-xs">Audit-ready logging</div>
        </div>
      </div>
    </div>
  );
}

function MockCards() {
  return (
    <div className="grid gap-4">
      <div className="card p-6 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-25"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,138,0,.35) 0%, rgba(255,176,64,.18) 45%, rgba(255,255,255,.05) 100%)",
          }}
        />
        <div className="relative">
          <div className="muted text-xs">NovaPay Card</div>
          <div className="mt-2 text-xl font-semibold">**** 4027</div>
          <div className="mt-6 flex items-center justify-between">
            <div className="muted text-xs">Limits</div>
            <div className="text-sm font-semibold">$2,500/day</div>
          </div>
        </div>
      </div>
      <div className="card p-5">
        <div className="text-sm font-semibold">Spend controls</div>
        <p className="muted mt-2 text-sm">
          Merchant rules, geofencing hooks, and policy limits designed for modern finance.
        </p>
      </div>
    </div>
  );
}

function MockTreasury() {
  return (
    <div className="grid gap-4">
      <div className="card p-5">
        <div className="muted text-xs">Treasury routing</div>
        <div className="mt-1 text-lg font-semibold">Multi-destination settlement</div>
        <div className="muted mt-2 text-xs">Consolidation • Receipts • Reporting</div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="card p-5">
          <div className="muted text-xs">Risk posture</div>
          <div className="mt-1 text-lg font-semibold">Policy enforced</div>
          <div className="muted mt-2 text-xs">Limits + monitoring</div>
        </div>
        <div className="card p-5">
          <div className="muted text-xs">Settlement</div>
          <div className="mt-1 text-lg font-semibold">Solana Mainnet</div>
          <div className="muted mt-2 text-xs">Fast finality</div>
        </div>
      </div>
    </div>
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
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="muted text-sm">
              Connect your wallet to view your account overview and live SOL balance.
            </p>
            <div className="sm:block hidden">
              <WalletMultiButton />
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-3 mb-6">
              <div className="flex gap-4">
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
              <span className="pill">Wallet {shortKey(publicKey?.toBase58())}</span>
            </div>

            {tab === "overview" && (
              <div className="grid gap-4 md:grid-cols-3">
                <div className="card p-5">
                  <div className="muted text-xs">SOL balance</div>
                  <div className="mt-1 text-2xl font-semibold">
                    {sol === null ? "Loading…" : sol.toFixed(4)} SOL
                  </div>
                  <div className="muted mt-2 text-xs">Live balance pulled from chain</div>
                </div>

                <div className="card p-5">
                  <div className="muted text-xs">Network</div>
                  <div className="mt-1 text-lg font-semibold">Solana Mainnet</div>
                  <div className="muted mt-2 text-xs">Settlement finality in seconds</div>
                </div>

                <div className="card p-5">
                  <div className="muted text-xs">Account status</div>
                  <div className="mt-1 text-lg font-semibold">Active</div>
                  <div className="muted mt-2 text-xs">Non-custodial by design</div>
                </div>
              </div>
            )}

            {tab === "activity" && (
              <div className="card p-5">
                <div className="text-sm font-semibold">Activity feed</div>
                <p className="muted mt-2 text-sm leading-relaxed">
                  Activity will populate here as transfer modules and receipts are enabled. The dashboard is
                  structured to support a complete audit trail.
                </p>
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
        subtitle="A security posture that feels like real finance software—without overpromising."
      />

      <div className="mt-10 grid gap-4 md:grid-cols-2">
        <div className="card p-6">
          <div className="text-sm font-semibold">Non-custodial architecture</div>
          <p className="muted mt-2 text-sm leading-relaxed">
            Users maintain full control of funds. NovaPay never accesses private keys and never assumes custody.
          </p>
          <ul className="muted mt-4 space-y-2 text-sm">
            <li>• Wallet-native authentication</li>
            <li>• Verifiable on-chain state</li>
            <li>• Clear operational boundaries</li>
          </ul>
        </div>

        <div className="card p-6">
          <div className="text-sm font-semibold">Operational controls</div>
          <p className="muted mt-2 text-sm leading-relaxed">
            Policy-driven routing and monitoring hooks designed for real-world payment operations.
          </p>
          <ul className="muted mt-4 space-y-2 text-sm">
            <li>• Limits and step-up verification hooks</li>
            <li>• Receipt-first auditability</li>
            <li>• Transparent settlement workflows</li>
          </ul>
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
      a: "NovaPay is live on Solana Mainnet with wallet-native access and a real-time account dashboard.",
    },
    {
      q: "Does NovaPay hold my funds?",
      a: "No. NovaPay is non-custodial. Funds remain in your connected Solana wallet.",
    },
    {
      q: "What wallets are supported?",
      a: "Phantom and Solflare are supported by default, with additional wallet adapters available as needed.",
    },
    {
      q: "What is NovaPay built for?",
      a: "Modern payments, settlement, and financial UX designed for the on-chain economy.",
    },
  ];

  return (
    <section id="faq" className="containerX mt-24">
      <SectionTitle
        eyebrow="FAQ"
        title="Frequently asked questions"
        subtitle="Clear answers about the platform and how it works."
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
        <div className="muted text-sm">© {new Date().getFullYear()} NovaPay. All rights reserved.</div>
        <div className="flex gap-4 text-sm muted">
          <a className="hover:text-white" href="#">
            Privacy
          </a>
          <a className="hover:text-white" href="#">
            Security
          </a>
          <a className="hover:text-white" href="#">
            Status
          </a>
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
