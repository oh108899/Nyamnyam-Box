"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import BottomNav from "./components/BottomNav";
import LogoHeader from "./components/LogoHeader";
import BookmarkButton from "./components/bookmark/BookmarkButton";
import styles from "./page.module.css";
import { createClient } from "./utils/supabase/client";

type Recipe = {
  id: number;
  created_at: string;
  user_id: string;
  title: string;
  desc: string;
  thumb: string;
  difficulty: string;
  cooking_time: string;
  serving: string;
  is_AI: boolean;
  views: number | null;
};

export default function HomePage() {
  const supabase = createClient();

  const [pickRecipes, setPickRecipes] = useState<Recipe[]>([]);
  const [topRecipes, setTopRecipes] = useState<Recipe[]>([]);
  const [newRecipes, setNewRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const hasThumb = (thumb?: string | null) => Boolean(thumb?.trim());


  useEffect(() => {
    const fetchRecipes = async () => {
      setLoading(true);
      const [pickRes, topRes, newRes] = await Promise.all([
        supabase.from("recipes").select(),
        supabase
          .from("recipes")
          .select()
          .order("views", { ascending: false })
          .limit(10),
        supabase
          .from("recipes")
          .select()
          .order("created_at", { ascending: false })
          .limit(6),
      ]);

      if (pickRes.error) console.error(pickRes.error);
      if (topRes.error) console.error(topRes.error);
      if (newRes.error) console.error(newRes.error);

      const pickData = (pickRes.data ?? []) as Recipe[];
      const shuffled = [...pickData].sort(() => Math.random() - 0.5);
      setPickRecipes(shuffled.slice(0, 2));
      setTopRecipes((topRes.data ?? []) as Recipe[]);
      setNewRecipes((newRes.data ?? []) as Recipe[]);

      setLoading(false);
    };
    fetchRecipes();
  }, [supabase]);

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
              : pickRecipes.map((item) => (
                <article key={item.id} className={styles.pickCard}>
                  {hasThumb(item.thumb) 
                  ? (
                    <>
                      <Image src={item.thumb} alt={item.title} fill unoptimized className={styles.coverImage} sizes="(max-width: 768px) 100vw, 375px" />
                      {item.is_AI && <span className={styles.aiBadge}>AI레시피!</span>}
                    </>
                  ) : (
                    <div className={styles.imageSkeleton} aria-hidden="true" />
                  )}

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
              : topRecipes.map((item) => (
                <article key={item.id} className={styles.topRecipeCard}>
                  <div className={styles.squareImageWrap}>
                    {hasThumb(item.thumb) ? (
                      <>
                        <Image src={item.thumb} alt={item.title} fill className={styles.coverImage} sizes="(max-width: 768px) 100vw, 375px" />
                        {item.is_AI && <span className={styles.aiBadge}>AI레시피!</span>}
                      </>
                    ) : (
                      <div className={styles.imageSkeleton} aria-hidden="true" />
                    )}
                  </div>
                  <h3 className={styles.recipeTitle}>
                    <Link href={`/recipes/${item.id}`} className={styles.titleLink}>
                      {item.title}
                    </Link>
                  </h3>
                  <div className={styles.metaRow}>
                    <span className={styles.metaItem}>
                      <Image src="/images/people.svg" alt="" width={12} height={12} aria-hidden="true" />
                      조회수 {item.views ?? 0}
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
          <div className={styles.sectionHeaderRow}>
            <h2 className={styles.sectionTitle}>새로운 레시피</h2>
            <Link href="/recipes" className={styles.viewAllButton}>
              전체보기
            </Link>
          </div>

          <div className={styles.newRecipeGrid}>
            {loading
              ? Array.from({ length: 4 }, (_, index) => (
                <article key={`new-skeleton-${index}`} className={styles.newRecipeCard}>
                  <div className={styles.newRecipeImageWrap}>
                    <div className={styles.imageSkeleton} role="img" aria-label="레시피 이미지 로딩중" />
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
              : newRecipes.map((item) => (
                <article key={item.id} className={styles.newRecipeCard}>
                  <Link href={`/recipes/${item.id}`} className={styles.titleLink}>
                    <div className={styles.newRecipeImageWrap}>
                      {hasThumb(item.thumb) ? (
                        <Image src={item.thumb} alt={item.title} fill unoptimized className={styles.coverImage} sizes="(max-width: 768px) 100vw, 375px" />
                      ) : (
                        <div className={styles.imageSkeleton} aria-hidden="true" />
                      )}
                      <BookmarkButton itemId={String(item.id)} className={styles.BookmarkButton} imageClassName={styles.BookmarkIcon} />
                    </div>

                    <h3 className={styles.recipeTitle}>
                      {item.title}
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
                  </Link>
                </article>
              ))}
          </div>
        </section>

        <Link href="/recipes/new" className={styles.floatingButton} aria-label="글쓰기">
          <Image src="/images/write.svg" alt="" width={19} height={20} aria-hidden="true" />
        </Link>

        <BottomNav activeTab="home" />
      </div>
    </main>
  );
}
