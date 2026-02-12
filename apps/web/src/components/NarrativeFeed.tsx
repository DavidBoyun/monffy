"use client";

import { useState } from "react";
import Image from "next/image";
import { CheckCircle2, XCircle, Share2, Check, Twitter } from "lucide-react";

interface NarrativeFeedProps {
    id: string;
    narrative: string;
    isCorrect: boolean;
    resolvedAt: string | null;
}

function formatTimeAgo(dateStr: string): string {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
}

export function NarrativeFeed({ id, narrative, isCorrect, resolvedAt }: NarrativeFeedProps) {
    const [copied, setCopied] = useState(false);

    function handleCopy() {
        const text = `${narrative}\n\n🐰 MONFFY — Autonomous AI Agent on Monad\nhttps://monffy.xyz/agent`;
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }

    function handleShareX() {
        const text = encodeURIComponent(`${narrative}\n\n🐰 @monaboratory on Monad`);
        const url = encodeURIComponent("https://monffy.xyz/agent");
        window.open(`https://x.com/intent/tweet?text=${text}&url=${url}`, "_blank");
    }

    return (
        <div className="flex gap-4 group">
            <div className="flex-shrink-0 relative w-10 h-10">
                <Image
                    src="/monffy/icon.png"
                    alt="MONFFY"
                    fill
                    className="rounded-full object-cover border border-monffy-purple/20"
                />
                <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-monad-dark flex items-center justify-center ${isCorrect ? 'bg-monffy-mint' : 'bg-monffy-red'}`}>
                    {isCorrect
                        ? <CheckCircle2 className="w-3 h-3 text-black" />
                        : <XCircle className="w-3 h-3 text-white" />
                    }
                </div>
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2 mb-1.5">
                    <span className="font-bold text-sm text-white">MONFFY</span>
                    <span className="text-[10px] font-mono text-monad-text/30 tabular-nums">
                        {resolvedAt ? formatTimeAgo(resolvedAt) : "Recently"}
                    </span>
                    <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${isCorrect ? 'text-monffy-mint bg-monffy-mint/10' : 'text-monffy-red bg-monffy-red/10'}`}>
                        {isCorrect ? 'CORRECT' : 'WRONG'}
                    </span>
                </div>

                <div className={`
                    relative p-3.5 rounded-2xl rounded-tl-none border text-sm leading-relaxed
                    ${isCorrect
                        ? "bg-monffy-mint/5 border-monffy-mint/15 text-monad-text/90"
                        : "bg-monffy-red/5 border-monffy-red/15 text-monad-text/90"
                    }
                `}>
                    {narrative}
                </div>

                {/* Share buttons */}
                <div className="flex items-center gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                        onClick={handleShareX}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-medium text-monad-text/40 hover:text-white hover:bg-monffy-purple/15 border border-transparent hover:border-monffy-purple/20 transition-all"
                    >
                        <Twitter className="w-3 h-3" />
                        Share
                    </button>
                    <button
                        onClick={handleCopy}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-medium text-monad-text/40 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10 transition-all"
                    >
                        {copied ? <Check className="w-3 h-3 text-monffy-mint" /> : <Share2 className="w-3 h-3" />}
                        {copied ? "Copied!" : "Copy"}
                    </button>
                </div>
            </div>
        </div>
    );
}
