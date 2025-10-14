import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bookmarks with Friends",
  description: "Shared bookmarks from friends",
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
