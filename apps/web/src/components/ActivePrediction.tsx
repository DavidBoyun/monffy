"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { TrendingUp, TrendingDown, Timer, Flame, ArrowDown, Radio, Check } from "lucide-react";
import { createClient } from "@supabase/supabase-js";
import { useAccount } from "wagmi";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!.trim(),
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!.trim()
);

interface ActivePredictionProps {
    id: string;
    question: string;
    expiresAt: string | null;
    prediction: "UP" | "DOWN" | null;
    triggerType: "SPIKE" | "DUMP" | "QUIET" | string | null;
}

function Countdown({ expiresAt }: { expiresAt: string }) {
    const [timeLeft, setTimeLeft] = useState("");
    const [isUrgent, setIsUrgent] = useState(false);

    useEffect(() => {
        const updateTimer = () => {
            const remaining = new Date(expiresAt).getTime() - Date.now();
            if (remaining <= 0) {
                setTimeLeft("00:00");
                setIsUrgent(true);
                return;
            }
            setIsUrgent(remaining < 60000);
            const m = Math.floor(remaining / 60000);
            const s = Math.floor((remaining % 60000) / 1000);
            setTimeLeft(`${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`);
        };

        updateTimer();
        const interval = setInterval(updateTimer, 1000);
        return () => clearInterval(interval);
    }, [expiresAt]);

    return (
        <span className={`font-mono tabular-nums ${isUrgent ? "text-monffy-red animate-pulse" : "text-monffy-gold"}`}>
            {timeLeft}
        </span>
    );
}

function TriggerBadge({ type }: { type: string | null }) {
    const config = {
        SPIKE: { icon: <Flame className="w-3 h-3" />, label: "SPIKE", className: "bg-monffy-gold/15 text-monffy-gold border-monffy-gold/20" },
        DUMP: { icon: <ArrowDown className="w-3 h-3" />, label: "DUMP", className: "bg-monffy-red/15 text-monffy-red border-monffy-red/20" },
        QUIET: { icon: <Radio className="w-3 h-3" />, label: "QUIET", className: "bg-monffy-blue/15 text-monffy-blue border-monffy-blue/20" },
    }[type || ""] ?? { icon: <Radio className="w-3 h-3" />, label: "LIVE", className: "bg-monffy-purple/15 text-monffy-purple border-monffy-purple/20" };

    return (
        <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${config.className}`}>
            {config.icon}
            {config.label}
        </div>
    );
}

export function ActivePrediction({ id, question, expiresAt, prediction, triggerType }: ActivePredictionProps) {
    const isUp = prediction === "UP";
    const { address } = useAccount();
    const [userPick, setUserPick] = useState<"UP" | "DOWN" | null>(null);
    const [submitting, setSubmitting] = useState(false);

    // Check if user already voted
    useEffect(() => {
        if (!address) return;
        supabase
            .from("responses")
            .select("selected_option")
            .eq("question_id", id)
            .eq("wallet_address", address.toLowerCase())
            .maybeSingle()
            .then(({ data }) => {
                if (data) {
                    setUserPick(data.selected_option === 0 ? "UP" : "DOWN");
                }
            });
    }, [id, address]);

    async function handleVote(pick: "UP" | "DOWN") {
        if (!address || userPick || submitting) return;
        setSubmitting(true);

        const { error } = await supabase.from("responses").insert({
            question_id: id,
            wallet_address: address.toLowerCase(),
            selected_option: pick === "UP" ? 0 : 1,
        });

        if (error) {
            console.error("Vote failed:", error);
        } else {
            setUserPick(pick);
        }
        setSubmitting(false);
    }

    return (
        <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-monffy-purple/30 to-monffy-light/20 rounded-2xl opacity-0 group-hover:opacity-100 blur transition-opacity duration-500" />
            <div className="relative rounded-2xl glass-panel-hover p-5">
                <div className="flex justify-between items-start mb-4">
                    <TriggerBadge type={triggerType} />
                    {expiresAt && (
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-monad-surface/50 border border-monad-border">
                            <Timer className="w-3 h-3 text-monffy-gold" />
                            <span className="text-xs text-monad-text/70">
                                <Countdown expiresAt={expiresAt} />
                            </span>
                        </div>
                    )}
                </div>

                <h3 className="text-base font-medium text-white mb-5 leading-relaxed">
                    {question}
                </h3>

                {/* MONFFY's prediction */}
                <div className="flex items-end gap-3 mb-4">
                    <div className="relative w-9 h-9 flex-shrink-0">
                        <Image src="/monffy/avatar.png" alt="MONFFY" fill className="rounded-full object-cover border-2 border-monad-surface" />
                    </div>

                    {prediction ? (
                        <div className={`
                            relative px-4 py-2.5 rounded-2xl rounded-bl-sm border
                            ${isUp
                                ? "bg-monffy-mint/8 border-monffy-mint/20 text-monffy-mint"
                                : "bg-monffy-red/8 border-monffy-red/20 text-monffy-red"
                            }
                        `}>
                            <div className="text-sm font-bold flex items-center gap-2">
                                {isUp
                                    ? <><TrendingUp className="w-4 h-4" /> Betting UP!</>
                                    : <><TrendingDown className="w-4 h-4" /> Going DOWN!</>
                                }
                            </div>
                        </div>
                    ) : (
                        <div className="px-4 py-2.5 rounded-2xl rounded-bl-sm border border-monad-border bg-monad-surface/50 text-monad-text/50 text-sm">
                            Analyzing market data...
                        </div>
                    )}
                </div>

                {/* User vote */}
                {userPick ? (
                    <div className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border ${
                        userPick === "UP"
                            ? "bg-monffy-mint/10 border-monffy-mint/20 text-monffy-mint"
                            : "bg-monffy-red/10 border-monffy-red/20 text-monffy-red"
                    }`}>
                        <Check className="w-4 h-4" />
                        <span className="text-sm font-bold">Your pick: {userPick}</span>
                    </div>
                ) : address ? (
                    <div className="flex gap-2">
                        <button
                            onClick={() => handleVote("UP")}
                            disabled={submitting}
                            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-monffy-mint/20 text-monffy-mint hover:bg-monffy-mint/10 transition-all text-sm font-bold disabled:opacity-50"
                        >
                            <TrendingUp className="w-4 h-4" /> UP
                        </button>
                        <button
                            onClick={() => handleVote("DOWN")}
                            disabled={submitting}
                            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-monffy-red/20 text-monffy-red hover:bg-monffy-red/10 transition-all text-sm font-bold disabled:opacity-50"
                        >
                            <TrendingDown className="w-4 h-4" /> DOWN
                        </button>
                    </div>
                ) : (
                    <div className="text-center py-2 text-[11px] text-monad-text/30 font-mono">
                        Connect wallet to predict
                    </div>
                )}
            </div>
        </div>
    );
}
