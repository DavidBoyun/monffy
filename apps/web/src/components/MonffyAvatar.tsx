import Image from "next/image";

interface MonffyAvatarProps {
    size?: "sm" | "md" | "lg" | "xl";
    state?: "default" | "sleeping" | "happy" | "thinking";
    className?: string;
    withBorder?: boolean;
}

const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-24 h-24",
    xl: "w-48 h-48",
};

export function MonffyAvatar({ size = "md", state = "default", className = "", withBorder = true }: MonffyAvatarProps) {
    // Map states to image files (transparent PNGs)
    const imageSrc =
        state === "sleeping" ? "/monffy/sleeping.png" :
            "/monffy/icon.png";

    return (
        <div className={`
       relative rounded-full overflow-hidden
       ${sizeClasses[size]}
       ${withBorder ? "border-2 border-monad-surface shadow-lg" : ""}
       ${className}
    `}>
            <Image
                src={imageSrc}
                alt={`Monffy ${state}`}
                fill
                className="object-cover"
            />
        </div>
    );
}
