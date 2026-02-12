"use client";

import Link from "next/link";
import Image from "next/image";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { MonffyAvatar } from "@/components/MonffyAvatar";
import { ArrowRight, ExternalLink } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-monad-black text-white selection:bg-monffy-purple/30 relative font-sans overflow-x-hidden">

      {/* Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[800px] h-[800px] bg-monffy-purple/8 rounded-full blur-[150px] mix-blend-screen" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-monffy-mint/3 rounded-full blur-[120px] mix-blend-screen" />
        <div className="absolute top-[40%] left-[50%] w-[300px] h-[300px] bg-monffy-purple/5 rounded-full blur-[100px] mix-blend-screen" />
      </div>

      {/* Nav */}
      <nav className="fixed top-5 left-0 right-0 z-50 flex items-center justify-between px-5 py-2.5 max-w-5xl mx-5 lg:mx-auto rounded-2xl glass-panel border border-monffy-purple/8 transition-all duration-300">
        <div className="flex items-center gap-3">
          <MonffyAvatar size="sm" withBorder={false} className="ring-1 ring-monffy-purple/20" />
          <span className="font-bold text-base tracking-tight text-white">MONFFY</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="scale-90 origin-right">
            <ConnectButton />
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen pt-20 px-4 text-center">

        {/* Live Badge */}
        <div className="animate-slide-up opacity-0 [animation-delay:100ms] flex items-center gap-2 px-4 py-1.5 rounded-full bg-monffy-mint/8 border border-monffy-mint/15 backdrop-blur-md mb-8 cursor-default group">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-monffy-mint opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-monffy-mint" />
          </span>
          <span className="text-[10px] font-mono font-bold text-monffy-mint tracking-wider uppercase">
            Live on Monad Mainnet
          </span>
        </div>

        {/* Headline */}
        <h1 className="animate-slide-up opacity-0 [animation-delay:300ms] text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter text-white leading-[0.9] mb-8">
          PREDICT<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-b from-monffy-purple to-[#3d2d80] text-glow">THE FUTURE</span>
        </h1>

        <p className="animate-slide-up opacity-0 [animation-delay:500ms] text-lg md:text-xl text-monad-text/40 max-w-lg mx-auto leading-relaxed mb-12">
          The first autonomous AI agent on Monad. <br className="hidden md:block" />
          Predicts markets, talks trash, writes history. 24/7.
        </p>

        {/* CTA Buttons */}
        <div className="animate-slide-up opacity-0 [animation-delay:700ms] flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto z-20">
          <Link
            href="/agent"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-10 py-4 bg-monffy-purple text-white font-bold text-base rounded-xl hover:bg-monffy-light transition-all active:scale-[0.98] duration-200 shadow-[0_0_40px_rgba(110,84,255,0.2)] hover:shadow-[0_0_60px_rgba(110,84,255,0.35)]"
          >
            Launch Terminal
            <ArrowRight className="w-4 h-4" />
          </Link>
          <a
            href="https://monad.xyz"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-10 py-4 rounded-xl border border-white/8 hover:bg-white/5 text-monad-text/50 hover:text-monad-text/80 font-medium text-base transition-all backdrop-blur-sm"
          >
            Monad Ecosystem
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Character Image */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80vw] max-w-[600px] h-[60vh] max-h-[600px] z-[-1] pointer-events-none select-none" style={{ maskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 65%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 65%, transparent 100%)' }}>
          <Image
            src="/monffy/hero.png"
            alt="MONFFY - Autonomous AI Prediction Agent"
            fill
            className="object-contain opacity-70 drop-shadow-[0_-20px_60px_rgba(110,84,255,0.2)]"
            priority
          />
        </div>

      </div>

      {/* Footer */}
      <footer className="absolute bottom-6 w-full text-center pb-6 z-10">
        <div className="flex items-center justify-center gap-6 text-monad-text/15 hover:text-monad-text/40 transition-colors duration-500">
          <span className="font-mono font-bold tracking-[0.2em] text-xs uppercase">Monad</span>
          <span className="w-1 h-1 rounded-full bg-current" />
          <span className="font-mono font-bold tracking-[0.2em] text-xs uppercase">Pyth</span>
        </div>
      </footer>
    </main>
  );
}
