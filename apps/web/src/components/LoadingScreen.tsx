import { MonffyAvatar } from "@/components/MonffyAvatar";

export function LoadingScreen() {
    return (
        <main className="min-h-screen flex items-center justify-center bg-monad-black">
            <div className="text-center flex flex-col items-center gap-5">
                <div className="animate-float">
                    <MonffyAvatar size="lg" state="default" withBorder={false} className="ring-4 ring-monffy-purple/20" />
                </div>
                <div className="space-y-2">
                    <p className="text-sm text-monad-text/50 font-medium animate-pulse">
                        Waking up MONFFY...
                    </p>
                    <div className="flex items-center justify-center gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-monffy-purple/40 animate-bounce [animation-delay:0ms]" />
                        <div className="w-1.5 h-1.5 rounded-full bg-monffy-purple/40 animate-bounce [animation-delay:150ms]" />
                        <div className="w-1.5 h-1.5 rounded-full bg-monffy-purple/40 animate-bounce [animation-delay:300ms]" />
                    </div>
                </div>
            </div>
        </main>
    );
}
