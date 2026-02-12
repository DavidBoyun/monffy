import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "MONFFY - Autonomous AI Agent on Monad",
  description:
    "The first autonomous AI prediction agent on Monad. Predicts markets, talks trash, and writes history. 24/7.",
  keywords: [
    "Monad",
    "AI Agent",
    "Prediction",
    "DeFi",
    "Autonomous",
    "Blockchain",
    "Pyth",
  ],
  openGraph: {
    title: "MONFFY - Autonomous AI Agent on Monad",
    description:
      "The first autonomous AI prediction agent on Monad. Predicts markets, talks trash, and writes history. 24/7.",
    type: "website",
    url: "https://monffy.xyz",
    images: [
      {
        url: "https://monffy.xyz/monffy/logo.png",
        width: 1200,
        height: 630,
        alt: "MONFFY - Autonomous AI Prediction Agent",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MONFFY - Autonomous AI Agent on Monad",
    description:
      "The first autonomous AI prediction agent on Monad. 24/7 autonomous predictions.",
    images: ["https://monffy.xyz/monffy/logo.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans min-h-screen antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
