import type { Metadata } from "next";
import { Teachers } from "next/font/google";
import "./globals.css";

const teachers = Teachers({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});


export const metadata: Metadata = {
  title: "Memento",
  description: "Photobox app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${teachers.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
