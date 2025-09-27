import { Outfit } from "next/font/google";
import "./globals.css";
import { AppContextProvider }  from "../context/AppContext";
import { Toaster } from "react-hot-toast";
import { ClerkProvider } from "@clerk/nextjs";
import Header from "@/components/Navbar";
import Footer from "@/components/Footer";

const outfit = Outfit({ subsets: ['latin'], weight: ["300", "400", "500"] })

export const metadata = {
  title: "Flexters",
  description: "E-Commerce with Next.js ",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${outfit.className} antialiased text-gray-700`} >
          <Toaster />
          <AppContextProvider>
            <Header />
            <main className="min-h-screen">{children}</main>
            <Footer />
          </AppContextProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
