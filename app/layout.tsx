import type { Metadata } from "next";
import "./globals.css";


export const metadata: Metadata = {
  title: "냠냠박스",
  description: "AI를 통한 레시피 공유 사이트",
  verification: {
    google: 'Xx4JNfYBY4kWvTI1u5DnN8uB6FN4ddd2vG6IU39vX5w', 
  },
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
