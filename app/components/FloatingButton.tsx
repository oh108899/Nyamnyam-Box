import Image from "next/image";
import Link from "next/link";
import styles from "./FloatingButton.module.css";

export default function FloatingButton() {
  return (
    <Link href="/recipes/new" className={styles.floatingButton} aria-label="글쓰기">
      <Image src="/images/write.svg" alt="" width={19} height={20} aria-hidden="true" />
    </Link>
  )
}