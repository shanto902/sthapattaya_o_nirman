import Navigation from "@/components/navigation/Navigation";
import "./globals.css";
import type { Metadata } from "next";
import { Noto_Serif_Bengali, Raleway } from "next/font/google";
import Footer from "@/components/navigation/Footer";
import { Suspense } from "react";
import Loading from "./loading";
const banglaFont = Noto_Serif_Bengali({
  subsets: ["latin"],
});

const englishFont = Raleway({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sthapattyan O Nirman",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
  params: { lang },
}: {
  children: React.ReactNode;
  params: {
    lang: string;
  };
}) {
  return (
    <html lang={lang}>
      <body
        className={lang === "bn" ? banglaFont.className : englishFont.className}
      >
        <Navigation locale={lang} />
        <Suspense fallback={<Loading />}>
          <div className="pt-5 min-h-calc(100vh-300px)">{children}</div>
        </Suspense>
        <Footer locale={lang} />
      </body>
    </html>
  );
}
