import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "GLB Animation Studio - 3Dモデルにアニメーションを簡単追加",
  description: "ブラウザで簡単にGLB/GLTFモデルにアニメーションを追加できるツール。回転、移動、スケールなどのプリセットアニメーションを適用し、即座にプレビュー＆ダウンロード。",
  keywords: ["GLB", "GLTF", "3D", "アニメーション", "Animation", "Three.js", "WebGL", "Converter", "Tool"],
  authors: [{ name: "GLB Animation Studio Team" }],
  viewport: "width=device-width, initial-scale=1",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "GLB Animation Studio - 3Dモデルにアニメーションを簡単追加",
    description: "ブラウザで簡単にGLB/GLTFモデルにアニメーションを追加できるツール。",
    type: "website",
    locale: "ja_JP",
    siteName: "GLB Animation Studio",
  },
  twitter: {
    card: "summary_large_image",
    title: "GLB Animation Studio",
    description: "ブラウザで簡単にGLB/GLTFモデルにアニメーションを追加できるツール。",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
