import { sitePath } from "@/content/path";
import type { Metadata } from "next";
import "./globals.css";
import ThemeToggle from "@/components/ThemeToggle";
import { Nunito, Lora } from "next/font/google";

const nunito = Nunito({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-nunito",
});
const lora = Lora({
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-lora",
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
      className={`${nunito.variable} ${lora.variable}`}
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
