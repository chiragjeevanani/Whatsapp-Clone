import Geist from "next/font/local";
import "./globals.css";

export const metadata = {
  title: "Zetto Messenger Admin",
  description: "Zetto Messenger Premium Control Board",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full scroll-smooth antialiased">
      <body className="min-h-full flex flex-col bg-[#09090b]">
        {children}
      </body>
    </html>
  );
}
