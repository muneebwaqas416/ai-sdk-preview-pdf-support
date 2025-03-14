import "./global.css";
import { Toaster } from "sonner";
import { ThemeProvider } from "next-themes";
import { Geist } from "next/font/google";
import { FileProvider } from "./context/FileContext";

const geist = Geist({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${geist.className}`}>
      <body>
        <FileProvider>
                <ThemeProvider attribute="class" enableSystem forcedTheme="dark">
                <Toaster position="top-center" richColors />
                {children}
                </ThemeProvider>
        </FileProvider>
        
      </body>
    </html>
  );
}
