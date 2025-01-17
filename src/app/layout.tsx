import type { Metadata } from "next";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import { ThemeProvider } from "@mui/material/styles";
import theme from "@/theme";
import { CssBaseline } from "@mui/material";
import AppWalletProvider from "@/components/AppWalletProvider";

export const metadata: Metadata = {
  title: "SolDonate",
  description: "Solana donations made easy",
  icons: [
    {
      rel: "apple-touch-icon",
      sizes: "180x180",
      url: "/apple-touch-icon.png",
    },
    {
      rel: "icon",
      type: "image/x-icon",
      sizes: "48x48",
      url: "/favicon.ico",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "32x32",
      url: "/favicon-32x32.png",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "16x16",
      url: "/favicon-16x16.png",
    },
    {
      rel: "mask-icon",
      color: "#000000",
      url: "/safari-pinned-tab.svg",
    },
  ],
  manifest: "/site.webmanifest",
  openGraph: {
    title: "SolDonate",
    description: "Solana donations made easy",
    url: "https://soldonate.me",
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/social_image.png`,
        width: 1200,
        height: 600,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SolDonate",
    description: "Solana donations made easy",
    site: "@SolDonateMe",
    creator: "@_silto_",
    images: [`${process.env.NEXT_PUBLIC_BASE_URL}/twitter_image.png`],
  },
  other: {
    "msapplication-TileColor": "#000000",
    "theme-color": "#000000",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AppRouterCacheProvider>
          <AppWalletProvider>
            <CssBaseline />
            <ThemeProvider theme={theme}>{children}</ThemeProvider>
          </AppWalletProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
