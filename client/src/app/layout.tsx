import type { Metadata } from "next";
import { Geist, Geist_Mono, Poppins } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";

const poppins = Poppins({
  subsets: ["latin"], // Ensure Latin characters are included
  weight: ["400", "700"], // Specify the weights you need
  style: ["normal", "italic"], // Optionally include italic styles
  variable: "--font-poppins", // Define a CSS variable for the font
});

export const metadata: Metadata = {
  title: "NFT Marketplace",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        <Header />
        {children}
      </body>
    </html>
  );
}