"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Activity, Target, TrendingUp, Clock } from "lucide-react";

interface AgentStatsProps {
    wins: number;
    losses: number;
    accuracy: number;
    totalQuestions: number;
    uptimeSeconds: number;
    isOnline: boolean;
}

function formatUptime(seconds: number): string {
    const d = Math.floor(seconds / 86400);
    const h = Math.floor((seconds % 86400) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    if (d > 0) return `${d}D ${h}H`;
    if (h > 0) return `${h}H ${m}M`;
    return `${m}M`;
}

function AnimatedNumber({ value, suffix = "", decimals = 0 }: { value: number; suffix?: string; decimals?: number }) {
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
        let start = 0;
        const end = value;
        const duration = 1400;
        const startTime = Date.now();

        const timer = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease-out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            start = end * eased;

            if (progress >= 1) {
                setDisplayValue(end);
                clearInterval(timer);
            } else {
                setDisplayValue(start);
            }
        }, 16);

        return () => clearInterval(timer);
    }, [value]);

    return <span>{decimals > 0 ? displayValue.toFixed(decimals) : Math.floor(displayValue)}{suffix}</span>;
}

function CircularProgress({ value, size = 100, strokeWidth = 6 }: { value: number; size?: number; strokeWidth?: number }) {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const [offset, setOffset] = useState(circumference);

    useEffect(() => {
        const timer = setTimeout(() => {
            setOffset(circumference - (value / 100) * circumference);
        }, 100);
        return () => clearTimeout(timer);
    }, [value, circumference]);

    return (
        <svg width={size} height={size} className="transform -rotate-90">
            {/* Background circle */}
            <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke="rgba(110, 84, 255, 0.1)"
                strokeWidth={strokeWidth}
            />
            {/* Progress circle */}
            <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke="url(#progressGradient)"
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                className="transition-all duration-[1.4s] ease-out"
            />
            <defs>
                <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#6E54FF" />
                    <stop offset="100%" stopColor="#A78BFA" />
                </linearGradient>
            </defs>
        </svg>
    );
}

export function AgentStats({ wins, losses, accuracy, totalQuestions, uptimeSeconds, isOnline }: AgentStatsProps) {
    const total = wins + losses;
    const winRate = total > 0 ? (wins / total) * 100 : 0;

    return (
        <div className="w-full">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 stagger-children">

                {/* 1. Main Character Card */}
                <div className="md:col-span-2 relative h-[280px] rounded-3xl overflow-hidden glass-panel-hover group cursor-default">
                    <div className="absolute inset-0 bg-gradient-to-br from-monffy-purple/15 via-transparent to-transparent" />

                    {/* Character Image */}
                    <div className="absolute right-[-20px] bottom-[-40px] w-[300px] h-[300px] transition-transform duration-700 ease-out group-hover:scale-105 group-hover:-rotate-2">
                        <Image
                            src="/monffy/hero.png"
                            alt="MONFFY Agent Character"
                            fill
                            className="object-contain drop-shadow-2xl"
                            priority
                        />
                    </div>

                    <div className="relative z-10 p-8 flex flex-col justify-between h-full">
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                                    isOnline
                                        ? 'bg-monffy-mint/15 text-monffy-mint border-monffy-mint/20'
                                        : 'bg-monad-text/10 text-monad-text/40 border-monad-text/10'
                                }`}>
                                    <span className="relative flex h-1.5 w-1.5">
                                        {isOnline && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-monffy-mint opacity-75" />}
                                        <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${isOnline ? 'bg-monffy-mint' : 'bg-monad-text/30'}`} />
                                    </span>
                                    {isOnline ? 'Online' : 'Offline'}
                                </span>
                                <span className="text-xs font-mono text-monad-text/40">v2.1</span>
                            </div>
                            <h2 className="text-4xl font-bold text-white leading-tight tracking-tight">
                                MONFFY<br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-monffy-purple to-monffy-light">Agent</span>
                            </h2>
                        </div>

                        <div className="flex items-center gap-3">
                            <Clock className="w-4 h-4 text-monad-text/40" />
                            <div>
                                <p className="text-[10px] font-mono text-monad-text/40 uppercase tracking-widest">Uptime</p>
                                <p className="text-xl font-mono font-bold text-white tabular-nums tracking-tight">
                                    {formatUptime(uptimeSeconds)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. Accuracy - Circular Gauge */}
                <div className="md:col-span-1 rounded-3xl glass-panel-hover p-6 flex flex-col items-center justify-between relative overflow-hidden group cursor-default">
                    <div className="absolute top-[-20px] right-[-20px] w-32 h-32 bg-monffy-purple/8 rounded-full blur-3xl group-hover:bg-monffy-purple/15 transition-all duration-500" />

                    <div className="flex items-center gap-2 self-start relative z-10">
                        <Target className="w-3.5 h-3.5 text-monffy-purple" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-monad-text/50">Accuracy</span>
                    </div>

                    <div className="relative flex items-center justify-center my-2">
                        <CircularProgress value={accuracy} size={120} strokeWidth={6} />
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-3xl font-mono font-bold text-white tracking-tighter text-glow">
                                <AnimatedNumber value={accuracy} decimals={1} />
                            </span>
                            <span className="text-xs font-mono text-monad-text/40">%</span>
                        </div>
                    </div>

                    <p className="text-[10px] font-mono text-monad-text/40 text-center relative z-10">
                        {totalQuestions} predictions
                    </p>
                </div>

                {/* 3. W/L Performance */}
                <div className="md:col-span-1 rounded-3xl glass-panel-hover p-6 flex flex-col justify-between relative overflow-hidden cursor-default">

                    <div className="flex items-center gap-2 mb-4">
                        <TrendingUp className="w-3.5 h-3.5 text-monffy-purple" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-monad-text/50">Performance</span>
                    </div>

                    <div className="flex justify-center gap-6 mb-4">
                        <div className="text-center">
                            <span className="block text-3xl font-mono font-bold text-monffy-mint tabular-nums">
                                <AnimatedNumber value={wins} />
                            </span>
                            <span className="block text-[10px] font-mono text-monad-text/40 uppercase tracking-wider mt-1">Wins</span>
                        </div>
                        <div className="w-px bg-white/10 self-stretch" />
                        <div className="text-center">
                            <span className="block text-3xl font-mono font-bold text-monffy-red tabular-nums">
                                <AnimatedNumber value={losses} />
                            </span>
                            <span className="block text-[10px] font-mono text-monad-text/40 uppercase tracking-wider mt-1">Losses</span>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between text-[10px] text-monad-text/60 font-mono uppercase tracking-wider">
                            <span>Win Rate</span>
                            <span className="tabular-nums">{winRate.toFixed(1)}%</span>
                        </div>
                        <div className="h-2.5 w-full bg-monad-black rounded-full overflow-hidden flex border border-white/5 relative">
                            <div className="absolute inset-0 flex justify-between px-[10%]">
                                {[...Array(4)].map((_, i) => (
                                    <div key={i} className="w-px h-full bg-white/5" />
                                ))}
                            </div>
                            <div
                                style={{ width: `${winRate}%` }}
                                className="h-full bg-gradient-to-r from-monffy-mint to-emerald-400 shadow-[0_0_12px_rgba(60,189,44,0.3)] relative z-10 rounded-full transition-all duration-1000 ease-out"
                            />
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
