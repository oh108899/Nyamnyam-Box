import Image from "next/image";
import Link from "next/link";

type NavTab = "home" | "recipes" | "my";

interface BottomNavProps {
  activeTab: NavTab;
  bottomNavClassName: string;
  navItemClassName: string;
  navItemActiveClassName: string;
  navItemInactiveClassName: string;
  navLinkClassName: string;
}

export default function BottomNav({
  activeTab,
  bottomNavClassName,
  navItemClassName,
  navItemActiveClassName,
  navItemInactiveClassName,
  navLinkClassName,
}: BottomNavProps) {
  const getTabClassName = (tab: NavTab) =>
    `${navItemClassName} ${tab === activeTab ? navItemActiveClassName : navItemInactiveClassName}`;

  return (
    <nav className={bottomNavClassName}>
      <Link href="/" className={`${getTabClassName("home")} ${navLinkClassName}`}>
        <Image
          src={activeTab === "home" ? "/images/home.svg" : "/images/home-inactive.svg"}
          alt=""
          width={14}
          height={16}
          aria-hidden="true"
        />
        <span>홈</span>
      </Link>

      <Link href="/recipes" className={`${getTabClassName("recipes")} ${navLinkClassName}`}>
        <Image
          src={activeTab === "recipes" ? "/images/recipe-active.svg" : "/images/recipe.svg"}
          alt=""
          width={14}
          height={16}
          aria-hidden="true"
        />
        <span>레시피</span>
      </Link>

      <button type="button" className={`${navItemClassName} ${navItemInactiveClassName}`}>
        <Image src="/images/bookmark.svg" alt="" width={13} height={16} aria-hidden="true" />
        <span>북마크</span>
      </button>

      <Link href="/my" className={`${getTabClassName("my")} ${navLinkClassName}`}>
        <Image
          src={activeTab === "my" ? "/images/my-active.svg" : "/images/my.svg"}
          alt=""
          width={16}
          height={16}
          aria-hidden="true"
        />
        <span>마이페이지</span>
      </Link>
    </nav>
  );
}
