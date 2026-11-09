import type { Metadata } from "next";
import { Marketing } from "@/components/marketing";
export const metadata: Metadata = {
  metadataBase: new URL(process.env.URL || "http://localhost:3000"),
  title: "RivalScope AI — See the signals. Make your next move.",
  description:
    "Evidence-backed competitor research, comparisons, website monitoring and an AI copilot. Bring your competitive landscape into focus with RivalScope.",
  openGraph: {
    title: "RivalScope AI — See the signals. Make your next move.",
    description:
      "Research your competitors. Follow the evidence. Stay close to your market.",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/marketing-og.png",
        width: 1200,
        height: 630,
        alt: "RivalScope AI — Evidence-backed competitive intelligence",
      },
    ],
  },
};
export default function Home() {
  return <Marketing />;
}
