"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import Image from "next/image";
import { Eye, BookOpen, Zap, BrainCircuit, Sparkles, Home, Bot, Radio, ExternalLink, Shield } from "lucide-react";
import { AgentStats } from "@/components/AgentStats";
import { ActivePrediction } from "@/components/ActivePrediction";
import { NarrativeFeed } from "@/components/NarrativeFeed";
import { ActivityItem } from "@/components/ActivityFeed";
import { SectionHeader } from "@/components/Layout";
import { LoadingScreen } from "@/components/LoadingScreen";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!.trim();
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!.trim();
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface AgentStatsData {
  total_questions: number;
  total_predictions: number;
  correct_predictions: number;
  accuracy: number;
  uptime_seconds: number;
  last_action_at: string | null;
}

interface AgentActionRow {
  id: string;
  action_type: string;
  data: string;
  tx_hash: string | null;
  created_at: string;
}

interface QuestionRow {
  id: string;
  question_text: string;
  options: string[];
  expires_at: string | null;
  resolved_at: string | null;
  resolution_outcome: boolean | null;
  agent_prediction: string | null;
  agent_correct: boolean | null;
  agent_narrative: string | null;
  trigger_type: string | null;
  is_active: boolean;
}

const NAV_LINKS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/agent", label: "Agent", icon: Bot },
];

const ONCHAIN_PROOF = [
  { label: "Agent Wallet", address: "0x07eAC2Ccd0Fa94A259CadCEaCf1C86c1Dea245f8", type: "address" as const },
  { label: "MicroMarket", address: "0xDb3a5B6ec64dFe62EA050d597AFa075A26D7Eee0", type: "address" as const },
  { label: "ClawLog", address: "0x73559F1E246D04BA7835ACEC9003348506F5FC8e", type: "address" as const },
];

export default function AgentPage() {
  const [stats, setStats] = useState<AgentStatsData | null>(null);
  const [actions, setActions] = useState<AgentActionRow[]>([]);
  const [activeQuestions, setActiveQuestions] = useState<QuestionRow[]>([]);
  const [recentNarratives, setRecentNarratives] = useState<QuestionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  const fetchData = useCallback(async () => {
    const [statsRes, actionsRes, activeRes, narrativesRes] = await Promise.all([
      supabase.from("agent_stats").select("*").eq("id", 1).single(),
      supabase
        .from("agent_actions")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(20),
      supabase
        .from("questions")
        .select("*")
        .eq("is_active", true)
        .eq("lane", "prediction")
        .order("created_at", { ascending: false })
        .limit(5),
      supabase
        .from("questions")
        .select("*")
        .eq("lane", "prediction")
        .not("agent_narrative", "is", null)
        .order("resolved_at", { ascending: false })
        .limit(5),
    ]);

    if (statsRes.data) setStats(statsRes.data);
    if (actionsRes.data) setActions(actionsRes.data);
    if (activeRes.data) setActiveQuestions(activeRes.data);
    if (narrativesRes.data) setRecentNarratives(narrativesRes.data);
    setLastRefresh(new Date());
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10_000);
    return () => clearInterval(interval);
  }, [fetchData]);

  useEffect(() => {
    const channel = supabase
      .channel("agent-actions-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "agent_actions" },
        (payload) => {
          setActions((prev) => [payload.new as AgentActionRow, ...prev].slice(0, 20));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  const wins = stats?.correct_predictions ?? 0;
  const losses = (stats?.total_predictions ?? 0) - wins;

  // Agent is online if last action was within 2 minutes
  const isOnline = stats?.last_action_at
    ? Date.now() - new Date(stats.last_action_at).getTime() < 2 * 60 * 1000
    : false;

  return (
    <main className="min-h-screen bg-monad-black text-monad-text selection:bg-monffy-purple/30 pb-20">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-monffy-purple/5 to-transparent" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-monffy-purple/3 rounded-full blur-[120px]" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 glass-panel border-b border-monffy-purple/5">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0">
            <div className="relative w-7 h-7 transition-transform group-hover:scale-110 duration-300">
              <Image src="/monffy/icon.png" alt="MONFFY" fill className="rounded-full object-cover ring-2 ring-monffy-purple/20" />
            </div>
            <span className="text-sm font-bold text-white tracking-tight">MONFFY</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const Icon = link.icon;
              const isActive = link.href === "/agent";
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`relative flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                    isActive
                      ? "text-white bg-monffy-purple/15 border border-monffy-purple/20"
                      : "text-monad-text/50 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Status Badge */}
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${
            isOnline
              ? 'bg-gradient-to-r from-monffy-purple/20 to-monffy-mint/10 border-monffy-mint/15'
              : 'bg-monad-surface/40 border-monad-text/10'
          }`}>
            <span className="relative flex h-2 w-2">
              {isOnline && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-monffy-mint opacity-75" />}
              <span className={`relative inline-flex rounded-full h-2 w-2 ${isOnline ? 'bg-monffy-mint' : 'bg-monad-text/30'}`} />
            </span>
            <span className={`text-[10px] font-mono font-bold tracking-wider uppercase ${isOnline ? 'text-monffy-mint' : 'text-monad-text/40'}`}>
              {isOnline ? 'Live' : 'Offline'}
            </span>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 relative z-10">

        {/* Hero - Compact, connected to stats */}
        <section className="pt-8 pb-2 text-center animate-fade-in">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Bot className="w-4 h-4 text-monffy-purple" />
            <span className="text-[10px] font-mono text-monffy-purple/70 uppercase tracking-[0.2em]">Autonomous AI Agent</span>
          </div>
          <h2 className="text-2xl md:text-4xl font-bold text-white tracking-tight leading-tight mb-2">
            Predicting the Future{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-monffy-purple via-monffy-light to-monffy-purple text-glow">on Monad</span>
          </h2>
          <p className="text-xs md:text-sm text-monad-text/35 max-w-md mx-auto leading-relaxed">
            24/7 autonomous market analysis, predictions, and on-chain narratives.
          </p>

          {/* Inline Quick Stats */}
          {stats && (
            <div className="flex items-center justify-center gap-5 md:gap-8 mt-5 animate-slide-up opacity-0 [animation-delay:200ms]">
              <div className="text-center">
                <span className="block text-xl md:text-2xl font-mono font-bold text-white tabular-nums">{stats.accuracy.toFixed(1)}%</span>
                <span className="block text-[9px] font-mono text-monad-text/30 uppercase tracking-wider mt-0.5">Accuracy</span>
              </div>
              <div className="w-px h-8 bg-white/5" />
              <div className="text-center">
                <span className="block text-xl md:text-2xl font-mono font-bold text-monffy-mint tabular-nums">{wins}</span>
                <span className="block text-[9px] font-mono text-monad-text/30 uppercase tracking-wider mt-0.5">Wins</span>
              </div>
              <div className="w-px h-8 bg-white/5" />
              <div className="text-center">
                <span className="block text-xl md:text-2xl font-mono font-bold text-monffy-red tabular-nums">{losses}</span>
                <span className="block text-[9px] font-mono text-monad-text/30 uppercase tracking-wider mt-0.5">Losses</span>
              </div>
              <div className="w-px h-8 bg-white/5" />
              <div className="text-center">
                <span className="block text-xl md:text-2xl font-mono font-bold text-monad-text/80 tabular-nums">{stats.total_questions}</span>
                <span className="block text-[9px] font-mono text-monad-text/30 uppercase tracking-wider mt-0.5">Markets</span>
              </div>
            </div>
          )}
        </section>

        {/* Thin divider line connecting hero → stats */}
        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-monffy-purple/15 to-transparent" />
        </div>

        <div className="space-y-8">
          {/* On-chain Proof */}
          <div className="animate-slide-up opacity-0 [animation-delay:50ms]">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-3.5 h-3.5 text-monffy-mint/70" />
              <span className="text-[10px] font-mono text-monad-text/40 uppercase tracking-widest">On-chain Proof — Monad Mainnet</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {ONCHAIN_PROOF.map((item) => (
                <a
                  key={item.label}
                  href={`https://monadscan.com/${item.type}/${item.address}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2 px-3 py-1.5 rounded-lg bg-monad-surface/40 border border-monad-border hover:border-monffy-purple/30 transition-all duration-200"
                >
                  <span className="text-[11px] font-medium text-monad-text/60 group-hover:text-white transition-colors">{item.label}</span>
                  <span className="text-[10px] font-mono text-monffy-purple/50 group-hover:text-monffy-purple transition-colors">
                    {item.address.slice(0, 6)}...{item.address.slice(-4)}
                  </span>
                  <ExternalLink className="w-3 h-3 text-monad-text/20 group-hover:text-monffy-purple/70 transition-colors" />
                </a>
              ))}
            </div>
          </div>

          {/* Stats Cards */}
          <div className="animate-slide-up opacity-0 [animation-delay:100ms]">
            <AgentStats
              wins={wins}
              losses={losses}
              accuracy={stats?.accuracy ?? 0}
              totalQuestions={stats?.total_questions ?? 0}
              uptimeSeconds={stats?.uptime_seconds ?? 0}
              isOnline={isOnline}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-8">
              {/* Active Predictions */}
              <section className="animate-slide-up opacity-0 [animation-delay:200ms]">
                <SectionHeader title="Active Predictions" icon={<Eye className="w-4 h-4" />} />
                {activeQuestions.length === 0 ? (
                  <div className="glass-panel rounded-2xl p-8 glow-border relative overflow-hidden">
                    {/* Scanning animation background */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-monffy-purple/30 to-transparent animate-scan" />
                    </div>

                    <div className="relative flex flex-col md:flex-row items-center gap-6">
                      {/* Character with crystal ball effect */}
                      <div className="relative flex-shrink-0">
                        <div className="relative w-28 h-28">
                          <Image
                            src="/monffy/hero.png"
                            alt="MONFFY analyzing"
                            fill
                            className="object-contain animate-float"
                          />
                          {/* Crystal ball glow */}
                          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-16 h-8 bg-monffy-purple/20 rounded-full blur-xl animate-pulse" />
                        </div>
                      </div>

                      <div className="text-center md:text-left flex-1">
                        <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                          <BrainCircuit className="w-4 h-4 text-monffy-purple animate-pulse" />
                          <h3 className="text-base font-bold text-white">Scanning Price Feeds</h3>
                        </div>
                        <p className="text-sm text-monad-text/40 leading-relaxed">
                          Watching Pyth oracle for &gt;2% price movement.
                          A new prediction will appear automatically.
                        </p>
                        <div className="flex items-center gap-2 mt-3">
                          <div className="flex gap-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-monffy-purple/60 animate-bounce [animation-delay:0ms]" />
                            <div className="w-1.5 h-1.5 rounded-full bg-monffy-purple/60 animate-bounce [animation-delay:150ms]" />
                            <div className="w-1.5 h-1.5 rounded-full bg-monffy-purple/60 animate-bounce [animation-delay:300ms]" />
                          </div>
                          <span className="text-[10px] font-mono text-monad-text/25">Monitoring MON/USD via Pyth</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="grid gap-4 stagger-children">
                    {activeQuestions.map((q) => (
                      <ActivePrediction
                        key={q.id}
                        id={q.id}
                        question={q.question_text}
                        expiresAt={q.expires_at}
                        prediction={q.agent_prediction as "UP" | "DOWN" | null}
                        triggerType={q.trigger_type}
                      />
                    ))}
                  </div>
                )}
              </section>

              {/* Narrative Feed */}
              <section className="animate-slide-up opacity-0 [animation-delay:300ms]">
                <SectionHeader title="Narrative Feed" icon={<BookOpen className="w-4 h-4" />} />
                <div className="glass-panel rounded-2xl p-6 border border-monffy-purple/8 space-y-6">
                  {recentNarratives.length > 0 ? (
                    <div className="space-y-6 stagger-children">
                      {recentNarratives.map((q) => (
                        <NarrativeFeed
                          key={q.id}
                          id={q.id}
                          narrative={q.agent_narrative || ""}
                          isCorrect={q.agent_correct || false}
                          resolvedAt={q.resolved_at}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Sparkles className="w-7 h-7 text-monffy-purple/30 mx-auto mb-3" />
                      <p className="text-sm text-monad-text/30 font-mono">No narratives yet</p>
                      <p className="text-xs text-monad-text/20 mt-1">Stories appear after predictions are resolved</p>
                    </div>
                  )}
                </div>
              </section>
            </div>

            {/* Right Column: Activity Feed */}
            <div className="lg:col-span-1">
              <div className="sticky top-20 animate-slide-up opacity-0 [animation-delay:400ms]">
                {/* Activity Header with live pulse */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-monffy-purple" />
                    <h3 className="text-xs font-bold uppercase tracking-widest text-monad-text/60">Live Activity</h3>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Radio className="w-3 h-3 text-monffy-mint/60 animate-pulse" />
                    <span className="text-[9px] font-mono text-monad-text/25">
                      {lastRefresh.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                    </span>
                  </div>
                </div>

                <div className="glass-panel rounded-2xl p-4 border border-monffy-purple/8 max-h-[600px] overflow-y-auto">
                  {actions.length > 0 ? (
                    <div className="divide-y divide-white/[0.03]">
                      {actions.map((a) => (
                        <ActivityItem
                          key={a.id}
                          type={a.action_type}
                          data={a.data}
                          hash={a.tx_hash}
                          createdAt={a.created_at}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Zap className="w-6 h-6 text-monffy-purple/20 mx-auto mb-2" />
                      <p className="text-xs text-monad-text/30 font-mono">Waiting for events...</p>
                    </div>
                  )}
                </div>

                {/* Powered By */}
                <div className="mt-5 flex justify-center">
                  <div className="text-[10px] uppercase tracking-[0.2em] text-monad-text/20 font-mono">
                    Powered by <span className="text-monffy-purple/50">Monad</span> & <span className="text-monad-text/30">Pyth</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
