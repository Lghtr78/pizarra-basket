import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pizarra Basket — La Plata",
  description: "Pizarra táctica interactiva para básquet formativo en La Plata",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </head>
      <body className="antialiased bg-[#0f1117]">
        {children}
      </body>
    </html>
  );
}
