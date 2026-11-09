import { sitePath } from "@/content/path";
import type { Metadata } from "next";
import "./globals.css";
import ThemeToggle from "@/components/ThemeToggle";
import { Lora, Space_Grotesk, Roboto_Mono } from "next/font/google";

const space = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-space",
});
const lora = Lora({
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-lora",
});
const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto-mono",
});
export const metadata: Metadata = {
  metadataBase: new URL(process.env.SITE_URL || "http://localhost:3000"),
  icons: { icon: sitePath("/icon.svg") },
  title: "Emman Pedroso — Code, design & curiosity",
  description:
    "The creative and technical work of Jose Emmanuel G. Pedroso. Web development, graphic design, and digital illustration.",
  openGraph: {
    title: "Emman Pedroso — Code, design & curiosity",
    description: "A creative mind. A technical side.",
    images: [sitePath("/social.png")],
  },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${space.variable} ${lora.variable} ${robotoMono.variable}`}
      suppressHydrationWarning
    >
      <body>
        <ThemeToggle />
        <a className="skip-link" href="#portfolio">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
