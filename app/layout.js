import { Outfit } from "next/font/google";
import "./globals.css";
import { AppContextProvider } from "../context/AppContext";
import { Toaster } from "react-hot-toast";
import { ClerkProvider } from "@clerk/nextjs";
import Header from "@/components/Navbar";
import Footer from "@/components/Footer";
import Script from "next/script"; // ✅ ADD THIS
import MaintenanceBanner from "@/components/MaintenanceBanner";

const outfit = Outfit({ subsets: ["latin"], weight: ["300", "400", "500"] });

export const metadata = {
  title: "Flexters",
  description: "E-Commerce with Next.js",
  icons: {
  icon: [
    { url: "/favicon.ico" },
  ],
  apple: [
    { url: "/apple-touch-icon.png", sizes: "180x180" },
  ],
},
  other: {
    "facebook-domain-verification": "7eayafhpvlaj0qxxbq22b4rmlimyds",
  },
};

export default function RootLayout({ children }) {
  const pixelId = process.env.NEXT_PUBLIC_FB_PIXEL_ID; // ✅ GET FROM ENV

  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          {/* ✅ Facebook Pixel Script */}
          {pixelId && (
            <Script id="fb-pixel" strategy="afterInteractive">
              {`
                !function(f,b,e,v,n,t,s)
                {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                n.queue=[];t=b.createElement(e);t.async=!0;
                t.src=v;s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s)}(window, document,'script',
                'https://connect.facebook.net/en_US/fbevents.js');
                fbq('init', '${pixelId}');
                fbq('track', 'PageView');
              `}
            </Script>
          )}
          {/* ✅ Add favicon links manually */}
  <link rel="icon" href="/favicon.ico" />
  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
  <meta name="theme-color" content="#ffffff" />
        </head>

        <body className={`${outfit.className} antialiased text-gray-700`}>
          <Toaster />
          <AppContextProvider>
            <MaintenanceBanner />
            <Header />
            <main className="min-h-screen">{children}</main>
            <Footer />
          </AppContextProvider>

          {/* ✅ noscript fallback */}
          {pixelId && (
            <noscript>
              <iframe
                src={`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`}
                height="1"
                width="1"
                style={{ display: "none" }}
              />
            </noscript>
          )}
        </body>
      </html>
    </ClerkProvider>
  );
}
