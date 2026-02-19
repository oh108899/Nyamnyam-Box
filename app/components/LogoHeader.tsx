import Image from "next/image";
import Link from "next/link";

interface LogoHeaderProps {
  headerClassName: string;
  logoHeadingClassName: string;
  logoLinkClassName: string;
  headerButtonClassName: string;
  searchHref?: string;
}

export default function LogoHeader({
  headerClassName,
  logoHeadingClassName,
  logoLinkClassName,
  headerButtonClassName,
  searchHref = "/serch",
}: LogoHeaderProps) {
  return (
    <header className={headerClassName}>
      <h1 className={logoHeadingClassName}>
        <Link href="/" className={logoLinkClassName}>
          냠냠박스
        </Link>
      </h1>
      <Link href={searchHref} className={headerButtonClassName} aria-label="검색">
        <Image src="/images/serchIcon.svg" alt="" width={20} height={20} aria-hidden="true" />
      </Link>
    </header>
  );
}
