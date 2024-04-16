import "./globals.css";

import { Inter } from "next/font/google";
import { themeEffect } from "./theme-effect";
import { Analytics } from "./analytics";
import { Header } from "./header";
import { Footer } from "./footer";
import { doge } from "./doge";

import { Web3Modal } from './context/Web3Modal';
import { Toaster } from 'react-hot-toast';
import { ReactNode } from 'react';

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "mix.info",
  description:
    "mix.info is a simple UI to interact with MIX Contract on Klaytn Chain.",
  openGraph: {
    title: "mix.info",
    description:
      "mix.info is UI to interact with MIX Contract on Klaytn Chain.",
    url: "https://mix.info",
    siteName: "mix.info",
  },
  twitter: {
    card: "summary_large_image",
    site: "@Doge Sound Club",
    creator: "@dogesoundclub",
  },
  metadataBase: new URL("https://mix.info"),
};

export const viewport = {
  themeColor: "transparent",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.className} antialiased`}
      suppressHydrationWarning={true}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(${themeEffect.toString()})();(${doge.toString()})();`,
          }}
        />
      </head>
      <body className="dark:text-gray-100 max-w-2xl m-auto">
              <Web3Modal>
        <main className="p-6 pt-3 md:pt-6 min-h-screen">
          <Header />
          {children}
        </main>
        <Toaster position="bottom-right" reverseOrder={false} />
        <Footer />
        <Analytics />
        </Web3Modal>
      </body>
    </html>
  );
}
