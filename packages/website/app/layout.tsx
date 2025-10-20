import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "ingroup.news - bookmarks with friends",
  description: "Curated bookmarks shared with friends",
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        style={{
          backgroundColor: '#ffffff',
          color: '#000000',
          fontFamily: 'Times New Roman, Times, serif',
          margin: '0',
          padding: '0',
        }}
      >
        {children}
      </body>
    </html>
  );
}
