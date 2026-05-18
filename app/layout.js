import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Providers from "./providers"
import { Toaster } from "@/components/ui/sonner"

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

import StoreInitializer from "@/components/StoreInitializer";

export const metadata = {
  title: "Wearo",
  description: "Discover trendy apparel, unique designs, and high-quality clothing. A modern ecommerce clothing store built for a seamless shopping experience.",
};

export default function RootLayout({ children, modal }) {
  return (
    <html
      lang="en"
      className={`${plusJakarta.variable} h-full antialiased`}

    >
      <Providers>
        <StoreInitializer />
        <body className="min-h-full flex flex-col" >
          <Navbar />
          {children}
          {modal}
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 4000,
              style: {
                borderRadius: '12px',
                padding: '16px 20px',
                fontSize: '14px',
                fontWeight: 500,
              },
            }}
          />
          {/* <Footer /> */}
        </body>
      </Providers>
    </html>
  );
}
