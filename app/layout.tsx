import "./globals.css";

export const metadata = {
  title: "IMRWG",
  description: "Frontend clone website",
  icons: {
    icon: "/images/a1.jpeg",
    shortcut: "/images/a1.jpeg",
    apple: "/images/a1.jpeg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}