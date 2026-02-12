import { Target, Eye, Scale, FileText, Zap } from "lucide-react";

function getActionIcon(type: string) {
    const iconClass = "w-4 h-4";
    switch (type) {
        case "MARKET_CREATED": return <Target className={`${iconClass} text-monffy-gold`} />;
        case "PREDICTION_MADE": return <Eye className={`${iconClass} text-monffy-purple`} />;
        case "MARKET_RESOLVED": return <Scale className={`${iconClass} text-monffy-mint`} />;
        case "NARRATIVE_POSTED": return <FileText className={`${iconClass} text-monffy-light`} />;
        default: return <Zap className={`${iconClass} text-monffy-gold`} />;
    }
}

function getAccentColor(type: string): string {
    switch (type) {
        case "MARKET_CREATED": return "bg-monffy-gold";
        case "PREDICTION_MADE": return "bg-monffy-purple";
        case "MARKET_RESOLVED": return "bg-monffy-mint";
        case "NARRATIVE_POSTED": return "bg-monffy-light";
        default: return "bg-monffy-purple";
    }
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

interface ActivityItemProps {
    type: string;
    data: string;
    hash: string | null;
    createdAt: string;
}

export function ActivityItem({ type, data, hash, createdAt }: ActivityItemProps) {
    const accentColor = getAccentColor(type);

    return (
        <div className="relative flex gap-3 py-3 first:pt-0 last:pb-0 group">
            {/* Left color accent bar */}
            <div className={`w-0.5 self-stretch rounded-full ${accentColor} opacity-40 group-hover:opacity-100 transition-opacity duration-300`} />

            <div className="flex items-start gap-3 flex-1 min-w-0">
                <div className="w-7 h-7 rounded-lg bg-monad-surface/80 border border-monad-border flex items-center justify-center flex-shrink-0 group-hover:border-monffy-purple/20 transition-colors duration-300">
                    {getActionIcon(type)}
                </div>

                <div className="flex-1 min-w-0">
                    <p className="text-[13px] text-monad-text/75 line-clamp-2 leading-snug group-hover:text-monad-text/90 transition-colors">
                        {data}
                    </p>
                    <div className="flex items-center gap-3 mt-1">
                        <span className="text-[10px] text-monad-text/25 font-mono tabular-nums">
                            {formatTimeAgo(createdAt)}
                        </span>
                        {hash && (
                            <a
                                href={`https://monadscan.com/tx/${hash}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[10px] flex items-center gap-0.5 text-monffy-purple/40 hover:text-monffy-purple transition-colors font-mono"
                            >
                                tx ↗
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
