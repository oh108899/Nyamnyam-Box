import type { Metadata } from "next";
import "./globals.css";


export const metadata: Metadata = {
  title: "냠냠박스",
  description: "AI를 통한 레시피 공유 사이트",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        {children}
      </body>
    </html>
  );
}
