"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import BottomNav from "./components/BottomNav";
import LogoHeader from "./components/LogoHeader";
import styles from "./page.module.css";
import {createClient} from "./utils/supabase/client";

type Recipe = {
  id: number; created_at: string; user_id: string; title: string; desc: string; thumb: string; difficulty: string; cooking_time: string; serving: string
};

export default function HomePage() {
  const supabase = createClient();

  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipes = async () => {
      const { data, error } = await supabase
        .from("recipes")
        .select();
      if (error) {
        console.error(error);
      } else {
        setRecipes(data || []);
      }
      setLoading(false);
    };
    fetchRecipes();
  }, []);
  console.log(recipes);
  return (
    <main className={styles.viewport}>
      <div className={styles.page}>
        <LogoHeader
          headerClassName={styles.header}
          logoHeadingClassName={styles.logoHeading}
          logoLinkClassName={styles.logoLink}
          headerButtonClassName={styles.headerButton}
        />

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>오늘의 Pick!</h2>
          <div className={styles.horizontalScroll}>
            {loading
              ? Array.from({ length: 2 }, (_, index) => (
                  <article key={`pick-skeleton-${index}`} className={styles.pickCard}>
                    <div className={styles.imageSkeleton} role="img" aria-label="레시피 이미지 로딩중" />
                    <div className={styles.pickGradient} />
                    <div className={styles.pickTextWrap}>
                      <span className={styles.pickBadge}>Pick!</span>
                      <h3 className={styles.pickTitle}>제목 로딩중..</h3>
                    </div>
                  </article>
                ))
              : recipes.map((item) => (
                  <article key={item.id} className={styles.pickCard}>
                    <Image src={item.thumb} alt={item.title} fill className={styles.coverImage} sizes="(max-width: 768px) 100vw, 375px" />
                    <div className={styles.pickGradient} />
                    <div className={styles.pickTextWrap}>
                      <span className={styles.pickBadge}>Pick!</span>
                      <h3 className={styles.pickTitle}>
                        <Link href={`/recipes/${item.id}`} className={styles.titleLink}>
                          {item.title}
                        </Link>
                      </h3>
                    </div>
                  </article>
                ))}
          </div>
        </section>

        <section className={styles.sectionLargeGap}>
          <div className={styles.sectionHeaderRow}>
            <h2 className={styles.sectionTitle}>인기 레시피 TOP 10</h2>
            <button type="button" className={styles.viewAllButton}>
              전체보기
            </button>
          </div>

          <div className={styles.horizontalScroll}>
            {loading
              ? Array.from({ length: 3 }, (_, index) => (
                  <article key={`top-skeleton-${index}`} className={styles.topRecipeCard}>
                    <div className={styles.squareImageWrap}>
                      <div className={styles.imageSkeleton} role="img" aria-label="레시피 이미지 로딩중" />
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
              : recipes.map((item) => (
                  <article key={item.id} className={styles.topRecipeCard}>
                    <div className={styles.squareImageWrap}>
                      <Image src={item.thumb} alt={item.title} fill className={styles.coverImage} sizes="(max-width: 768px) 100vw, 375px" />
                    </div>
                    <h3 className={styles.recipeTitle}>
                      <Link href={`/recipes/${item.id}`} className={styles.titleLink}>
                        {item.title}
                      </Link>
                    </h3>
                    <div className={styles.metaRow}>
                      <span className={styles.metaItem}>
                        <Image src="/images/people.svg" alt="" width={12} height={12} aria-hidden="true" />
                        {item.serving}
                      </span>
                      <span className={styles.metaItem}>
                        <Image src="/images/cookTime.png" alt="" width={12} height={12} aria-hidden="true" />
                        {item.cooking_time}
                      </span>
                    </div>
                  </article>
                ))}
          </div>
        </section>

        <section className={styles.sectionBottom}>
          <h2 className={styles.sectionTitle}>새로운 레시피</h2>

          <div className={styles.newRecipeGrid}>
            {loading
              ? Array.from({ length: 4 }, (_, index) => (
                  <article key={`new-skeleton-${index}`} className={styles.newRecipeCard}>
                    <div className={styles.newRecipeImageWrap}>
                      <div className={styles.imageSkeleton} role="img" aria-label="레시피 이미지 로딩중" />
                      <button type="button" className={styles.favoriteButton} aria-label="북마크">
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
              : recipes.map((item) => (
                  <article key={item.id} className={styles.newRecipeCard}>
                    <div className={styles.newRecipeImageWrap}>
                      <Image src={item.thumb} alt={item.title} fill className={styles.coverImage} sizes="(max-width: 768px) 100vw, 375px" />
                      <button type="button" className={styles.favoriteButton} aria-label="북마크">
                        <Image src="/images/bookmark.svg" alt="" width={13} height={16} aria-hidden="true" />
                      </button>
                    </div>

                    <h3 className={styles.recipeTitle}>
                      <Link href={`/recipes/${item.id}`} className={styles.titleLink}>
                        {item.title}
                      </Link>
                    </h3>
                    <div className={styles.metaRow}>
                      <span className={styles.metaItem}>
                        <Image src="/images/cookTime.png" alt="" width={12} height={12} aria-hidden="true" />
                        {item.cooking_time}
                      </span>
                      <span className={styles.metaItem}>
                        <Image src="/images/people.svg" alt="" width={12} height={12} aria-hidden="true" />
                        {item.serving}
                      </span>
                    </div>
                  </article>
                ))}
          </div>
        </section>

        <button type="button" className={styles.floatingButton} aria-label="글쓰기">
          <Image src="/images/write.svg" alt="" width={19} height={20} aria-hidden="true" />
        </button>

        <BottomNav activeTab="home" />
      </div>
    </main>
  );
}
