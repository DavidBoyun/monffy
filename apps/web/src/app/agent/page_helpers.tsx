// Helper functions reused from original page logic or new helpers

export function formatUptime(seconds: number): string {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    if (h > 0) return `${h}h ${m}m`;
    return `${m}m`;
}

export function formatTimeAgo(dateStr: string): string {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
}

import React from 'react';

export function ActionIcon({ type }: { type: string }) {
    switch (type) {
        case "MARKET_CREATED":
            return <span title="Market Created">🎯</span>;
        case "PREDICTION_MADE":
            return <span title="Prediction Made">🐰</span>;
        case "MARKET_RESOLVED":
            return <span title="Market Resolved">✅</span>;
        case "NARRATIVE_POSTED":
            return <span title="Narrative">📝</span>;
        default:
            return <span>⚡</span>;
    }
}
