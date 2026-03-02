"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { createClient } from "../utils/supabase/client";
import BottomNav from "../components/BottomNav";
import LogoHeader from "../components/LogoHeader";
import BookmarkButton from "../components/bookmark/BookmarkButton";
import styles from "./page.module.css";
import FloatingButton from "../components/FloatingButton";

type Bookmark = {
  id: string;
  user_id: string;
  recipe_id: string;
  created_at: string;
  recipes: {
    id: string;
    thumb?: string | null;
    title?: string;
    cooking_time?: string;
    serving?: string;
    views?: number;
    review?: { count: number }[];
  };
}

export default function BookmarkPage() {
  const [loading, setLoading] = useState(true);
  const [isLogin, setIsLogin] = useState(false);
  const [bookmark, setBookmark] = useState<Bookmark[]>([]);

  useEffect(() => {
    const supabase = createClient();

    const fetchBookmark = async () => {
      setLoading(true);

      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }
      setIsLogin(true);

      const { data: bookmark, error: bookmarkError } = await supabase
        .from("bookmark")
        .select("*, recipes(*, review(count))")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (bookmarkError) {
        console.error(bookmarkError);
        setLoading(false);
        return;
      } else {
        setBookmark(bookmark || []);
        setLoading(false);
      }
    };
    fetchBookmark();
  }, []);



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
          <p className={styles.countText}>
            {loading ? "북마크 로딩중.." : (
              bookmark?.length > 0
                ? <>북마크한 레시피 <span className={styles.countTextNum}>{bookmark.length}개</span></>
                : null
            )}
          </p>

          <div className={styles.recipeGrid}>
            {loading
              ? Array.from({ length: 4 }, (_, index) => (
                <article key={`bookmark-skeleton-${index}`} className={styles.recipeCard}>
                  <div className={styles.recipeImageSkeleton} aria-hidden="true" />
                  <div className={styles.recipeTitleSkeleton} aria-hidden="true" />
                  <div className={styles.recipeMetaSkeleton} aria-hidden="true" />
                </article>
              ))
              : !isLogin ? <p className={styles.emptyText}>북마크 기능은 로그인 후 이용 가능합니다.</p>
                : bookmark.length === 0
                  ? (
                    <p className={styles.emptyText}>북마크한 레시피가 없습니다.</p>
                  )
                  : bookmark.map((item) => (
                    (() => {
                      const thumbSrc = item.recipes.thumb?.trim();
                      const recipeTitle = item.recipes.title ?? "레시피";
                      const reviewCount = item.recipes.review?.[0]?.count ?? 0;

                      return (
                        <article key={item.id} className={styles.recipeCard}>
                          <Link href={`/recipes/${item.recipes.id}`}>
                            <div className={styles.recipeImageWrap}>
                              {thumbSrc ? (
                                <Image src={thumbSrc} alt={recipeTitle} fill unoptimized className={styles.recipeImage} />
                              ) : (
                                <div className={styles.recipeImageSkeleton} aria-hidden="true" />
                              )}
                              <BookmarkButton
                                itemId={item.recipe_id}
                                className={styles.BookmarkButton}
                                imageClassName={styles.BookmarkIcon}
                                onToggle={(isBookmark) => !isBookmark && setBookmark(prev => prev.filter(bf => bf.recipe_id !== item.recipe_id))}
                              />
                            </div>
                          </Link>
                          <h3 className={styles.recipeTitle}>{recipeTitle}</h3>
                          <div className={styles.recipeMeta}>
                            <span className={`${styles.recipeMetaView} ${styles.recipeMetaBadge}`}>{item.recipes.views}</span>
                            {reviewCount > 0 && (
                              <span className={`${styles.recipeMetaComment} ${styles.recipeMetaBadge}`}>{reviewCount}</span>
                            )}
                          </div>
                        </article>
                      );
                    })()
                  ))}
          </div>
        </section>

        <FloatingButton />
        <BottomNav activeTab="bookmark" />
      </div>
    </main>
  );
}
