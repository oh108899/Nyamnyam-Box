"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import styles from "./page.module.css";

export default function HomePage() {
  const [loading] = useState(true);
  const DB: Array<{ id: string; src: string; alt: string; title: string; comments: string; time: string }> = [];
  

  return (
    <main className={styles.viewport}>
      <div className={`${styles.page} ui-mobile-page`}>
        <header className={`${styles.header} ui-page-header`}>
          <h1 className={styles.logoHeading}>
            <Link href="/" className={styles.logoLink}>
              냠냠박스
            </Link>
          </h1>
          <Link href="/serch" className={`${styles.headerButton} ui-reset-button`} aria-label="검색">
            <Image src="/images/serchIcon.svg" alt="" width={20} height={20} aria-hidden="true" />
          </Link>
        </header>

        <section className={styles.section}>
          <h2 className={`${styles.sectionTitle} ui-section-title`}>오늘의 Pick!</h2>
          <div className={`${styles.horizontalScroll} ui-scroll-x`}>
            {loading
              ? Array.from({ length: 2 }, (_, index) => (
                  <article key={`pick-skeleton-${index}`} className={styles.pickCard}>
                    <div className={`${styles.imageSkeleton} ui-skeleton`} role="img" aria-label="레시피 이미지 로딩중" />
                    <div className={styles.pickGradient} />
                    <div className={styles.pickTextWrap}>
                      <span className={styles.pickBadge}>Pick!</span>
                      <h3 className={styles.pickTitle}>제목 로딩중..</h3>
                    </div>
                  </article>
                ))
              : DB.map((item) => (
                  <article key={item.id} className={styles.pickCard}>
                    <Image src={item.src} alt={item.alt} fill className={styles.coverImage} sizes="(max-width: 768px) 100vw, 375px" />
                    <div className={styles.pickGradient} />
                    <div className={styles.pickTextWrap}>
                      <span className={styles.pickBadge}>Pick!</span>
                      <h3 className={styles.pickTitle}>{item.title}</h3>
                    </div>
                  </article>
                ))}
          </div>
        </section>

        <section className={styles.sectionLargeGap}>
          <div className={styles.sectionHeaderRow}>
            <h2 className={`${styles.sectionTitle} ui-section-title`}>인기 레시피 TOP 10</h2>
            <button type="button" className={`${styles.viewAllButton} ui-reset-button`}>
              전체보기
            </button>
          </div>

          <div className={`${styles.horizontalScroll} ui-scroll-x`}>
            {loading
              ? Array.from({ length: 3 }, (_, index) => (
                  <article key={`top-skeleton-${index}`} className={styles.topRecipeCard}>
                    <div className={styles.squareImageWrap}>
                      <div className={`${styles.imageSkeleton} ui-skeleton`} role="img" aria-label="레시피 이미지 로딩중" />
                    </div>
                    <h3 className={styles.recipeTitle}>제목 로딩중..</h3>
                    <div className={styles.metaRow}>
                      <span className={styles.metaItem}>
                        <Image src="/images/people.svg" alt="" width={12} height={12} aria-hidden="true" />
                        댓글 로딩중..
                      </span>
                      <span className={styles.metaItem}>
                        <Image src="/images/cookTime.png" alt="" width={12} height={12} aria-hidden="true" />
                        시간 로딩중..
                      </span>
                    </div>
                  </article>
                ))
              : DB.map((item) => (
                  <article key={item.id} className={styles.topRecipeCard}>
                    <div className={styles.squareImageWrap}>
                      <Image src={item.src} alt={item.alt} fill className={styles.coverImage} sizes="(max-width: 768px) 100vw, 375px" />
                    </div>
                    <h3 className={styles.recipeTitle}>{item.title}</h3>
                    <div className={styles.metaRow}>
                      <span className={styles.metaItem}>
                        <Image src="/images/people.svg" alt="" width={12} height={12} aria-hidden="true" />
                        {item.comments}
                      </span>
                      <span className={styles.metaItem}>
                        <Image src="/images/cookTime.png" alt="" width={12} height={12} aria-hidden="true" />
                        {item.time}
                      </span>
                    </div>
                  </article>
                ))}
          </div>
        </section>

        <section className={styles.sectionBottom}>
          <h2 className={`${styles.sectionTitle} ui-section-title`}>새로운 레시피</h2>

          <div className={styles.newRecipeGrid}>
            {loading
              ? Array.from({ length: 4 }, (_, index) => (
                  <article key={`new-skeleton-${index}`} className={styles.newRecipeCard}>
                    <div className={styles.newRecipeImageWrap}>
                      <div className={`${styles.imageSkeleton} ui-skeleton`} role="img" aria-label="레시피 이미지 로딩중" />
                      <button type="button" className={`${styles.favoriteButton} ui-reset-button`} aria-label="북마크">
                        <Image src="/images/bookmark.svg" alt="" width={13} height={16} aria-hidden="true" />
                      </button>
                    </div>

                    <h3 className={styles.recipeTitle}>제목 로딩중..</h3>
                    <div className={styles.metaRow}>
                      <span className={styles.metaItem}>
                        <Image src="/images/cookTime.png" alt="" width={12} height={12} aria-hidden="true" />
                        시간 로딩중..
                      </span>
                      <span className={styles.metaItem}>
                        <Image src="/images/people.svg" alt="" width={12} height={12} aria-hidden="true" />
                        댓글 로딩중..
                      </span>
                    </div>
                  </article>
                ))
              : DB.map((item) => (
                  <article key={item.id} className={styles.newRecipeCard}>
                    <div className={styles.newRecipeImageWrap}>
                      <Image src={item.src} alt={item.alt} fill className={styles.coverImage} sizes="(max-width: 768px) 100vw, 375px" />
                      <button type="button" className={`${styles.favoriteButton} ui-reset-button`} aria-label="북마크">
                        <Image src="/images/bookmark.svg" alt="" width={13} height={16} aria-hidden="true" />
                      </button>
                    </div>

                    <h3 className={styles.recipeTitle}>{item.title}</h3>
                    <div className={styles.metaRow}>
                      <span className={styles.metaItem}>
                        <Image src="/images/cookTime.png" alt="" width={12} height={12} aria-hidden="true" />
                        {item.time}
                      </span>
                      <span className={styles.metaItem}>
                        <Image src="/images/people.svg" alt="" width={12} height={12} aria-hidden="true" />
                        {item.comments}
                      </span>
                    </div>
                  </article>
                ))}
          </div>
        </section>

        <button type="button" className={`${styles.floatingButton} ui-reset-button`} aria-label="글쓰기">
          <Image src="/images/write.svg" alt="" width={19} height={20} aria-hidden="true" />
        </button>

        <nav className={styles.bottomNav}>
          <Link href="/" className={`${styles.navItem} ${styles.navItemActive} ${styles.navLink}`}>
            <Image src="/images/home.svg" alt="" width={14} height={16} aria-hidden="true" />
            <span>홈</span>
          </Link>
          <button type="button" className={`${styles.navItem} ${styles.navItemInactive} ui-reset-button`}>
            <Image src="/images/recipe.svg" alt="" width={14} height={16} aria-hidden="true" />
            <span>레시피</span>
          </button>
          <button type="button" className={`${styles.navItem} ${styles.navItemInactive} ui-reset-button`}>
            <Image src="/images/bookmark.svg" alt="" width={13} height={16} aria-hidden="true" />
            <span>북마크</span>
          </button>
          <button type="button" className={`${styles.navItem} ${styles.navItemInactive} ui-reset-button`}>
            <Image src="/images/my.svg" alt="" width={16} height={16} aria-hidden="true" />
            <span>마이페이지</span>
          </button>
        </nav>
      </div>
    </main>
  );
}
