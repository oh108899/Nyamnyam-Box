"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import BottomNav from "../components/BottomNav";
import LogoHeader from "../components/LogoHeader";
import styles from "./page.module.css";

export default function BookmarkPage() {
  const [loading] = useState(true);
  const DB: Array<{ id: string; src: string; alt: string; title: string; comments: string; time: string }> = [];

  return (
    <main className={styles.viewport}>
      <div className={styles.page}>
        <LogoHeader
          headerClassName={styles.header}
          logoHeadingClassName={styles.logoHeading}
          logoLinkClassName={styles.logoLink}
          headerButtonClassName={styles.headerButton}
        />

        <section className={styles.content}>
          <h2 className={styles.sectionTitle}>북마크한레시피</h2>
          <p className={styles.countText}>{loading ? "북마크 로딩중.." : `${DB.length}개`}</p>

          <div className={styles.recipeGrid}>
            {loading
              ? Array.from({ length: 4 }, (_, index) => (
                  <article key={`bookmark-skeleton-${index}`} className={styles.recipeCard}>
                    <div className={styles.recipeImageSkeleton} aria-hidden="true" />
                    <div className={styles.recipeTitleSkeleton} aria-hidden="true" />
                    <div className={styles.recipeMetaSkeleton} aria-hidden="true" />
                  </article>
                ))
              : DB.length === 0
                ? (
                    <p className={styles.emptyText}>북마크한 레시피가 없습니다.</p>
                  )
              : DB.map((item) => (
                  <article key={item.id} className={styles.recipeCard}>
                    <div className={styles.recipeImageWrap}>
                      <Image src={item.src} alt={item.alt} fill className={styles.recipeImage} />
                      <button type="button" className={styles.bookmarkButton} aria-label="북마크">
                        <Image src="/images/bookmark.svg" alt="" width={13} height={16} aria-hidden="true" />
                      </button>
                    </div>

                    <h3 className={styles.recipeTitle}>{item.title}</h3>
                    <div className={styles.recipeMeta}>
                      <span>
                        <Image src="/images/cookTime.png" alt="" width={12} height={12} aria-hidden="true" />
                        {item.time}
                      </span>
                      <span>
                        <Image src="/images/people.svg" alt="" width={12} height={12} aria-hidden="true" />
                        {item.comments}
                      </span>
                    </div>
                  </article>
                ))}
          </div>
        </section>

        <Link href="/recipes/new" className={styles.floatingButton} aria-label="글쓰기">
          <Image src="/images/write.svg" alt="" width={19} height={20} aria-hidden="true" />
        </Link>

        <BottomNav activeTab="bookmark" />
      </div>
    </main>
  );
}
