import Image from "next/image";
import Link from "next/link";
import styles from "./BottomNav.module.css";

type NavTab = "home" | "recipes" | "bookmark" | "my";

interface BottomNavProps {
  activeTab: NavTab;
}

export default function BottomNav({ activeTab }: BottomNavProps) {
  const getTabClassName = (tab: NavTab) =>
    `${styles.navItem} ${tab === activeTab ? styles.navItemActive : styles.navItemInactive}`;

  return (
    <nav className={styles.bottomNav}>
      <Link href="/" className={`${getTabClassName("home")} ${styles.navLink}`}>
        <Image
          src={activeTab === "home" ? "/images/home.svg" : "/images/home-inactive.svg"}
          alt=""
          width={14}
          height={16}
          aria-hidden="true"
        />
        <span>홈</span>
      </Link>

      <Link href="/recipes" className={`${getTabClassName("recipes")} ${styles.navLink}`}>
        <Image
          src={activeTab === "recipes" ? "/images/recipe-active.svg" : "/images/recipe.svg"}
          alt=""
          width={14}
          height={16}
          aria-hidden="true"
        />
        <span>레시피</span>
      </Link>

      <Link href="/bookmark" className={`${getTabClassName("bookmark")} ${styles.navLink}`}>
        <Image src="/images/bookmark.svg" alt="" width={13} height={16} aria-hidden="true" />
        <span>북마크</span>
      </Link>

      <Link href="/my" className={`${getTabClassName("my")} ${styles.navLink}`}>
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
