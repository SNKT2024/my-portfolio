// src/app/layout.tsx
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/portfolio/ThemeProvider";
import "./globals.css";
import { ResumeModalProvider } from "@/context/ResumeModalContext";

export const metadata = {
  title: "Sanket Kumbhar | Full Stack Developer",
  description: "Full-stack Developer building scalable systems.",
  openGraph: {
    title: "Sanket Kumbhar | Portfolio",
    description: "Full Stack Developer & Web Systems Developer",
    url: "https://your-portfolio.vercel.app",
    siteName: "Sanket Kumbhar Portfolio",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className="antialiased bg-background text-foreground">
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <ResumeModalProvider>{children}</ResumeModalProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
