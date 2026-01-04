import "./globals.css";
import Providers from "./providers";

export const metadata = {
  title: "NovaPay // Solana Neobank",
  description: "Solana-native neobank landing + wallet connect",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
