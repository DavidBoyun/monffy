import { PropsWithChildren, ReactNode } from "react";

export function SectionHeader({ title, icon }: { title: string; icon: ReactNode }) {
    return (
        <h2 className="text-lg font-bold mb-4 flex items-center gap-3 text-white">
            <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-monffy-purple/10 border border-monffy-purple/15 text-monffy-purple">
                {icon}
            </span>
            <span className="tracking-tight">{title}</span>
        </h2>
    );
}

export function Grid({ children, className = "" }: PropsWithChildren<{ className?: string }>) {
    return (
        <div className={`grid grid-cols-1 md:grid-cols-12 gap-6 ${className}`}>
            {children}
        </div>
    );
}
