"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { createClient } from "../utils/supabase/client";
import BottomNav from "../components/BottomNav";
import LogoHeader from "../components/LogoHeader";
import BookmarkButton from './../components/bookmark/BookmarkButton';
import styles from "./page.module.css";
import FloatingButton from "../components/FloatingButton";

type Recipe = {
  id: number;
  title: string;
  thumb: string | null;
  is_AI: boolean;
  views: number | null;
  review: { count: number }[] | null;
};

export default function RecipesPage() {
  const supabase = createClient();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipes = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("recipes")
        .select("id, title, thumb, is_AI, views, review(count)");
      if (error) {
        console.error(error);
      } else {
        setRecipes((data ?? []) as Recipe[]);
      }

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

        <section className={styles.content}>
          <p className={styles.countText}>{loading
            ? "레시피 로딩중.."
            : (
              <>
                냠냠박스 레시피 <span className={styles.countTextNum}>{recipes.length}개</span>
              </>
            )}
          </p>

          <div className={styles.recipeGrid}>
            {loading
              ? Array.from({ length: 6 }, (_, index) => (
                <article key={`recipe-skeleton-${index}`} className={styles.recipeCard}>
                  <div className={styles.recipeImageSkeleton} aria-hidden="true" />
                  <div className={styles.recipeTitleSkeleton} aria-hidden="true" />
                  <div className={styles.recipeMetaSkeleton} aria-hidden="true" />
                </article>
              ))
              : recipes.map((recipe) => (
                <article key={recipe.id} className={styles.recipeCard}>
                  <Link href={`/recipes/${recipe.id}`}>
                    <div className={styles.recipeImageWrap}>
                      {recipe.is_AI && <span className={styles.aiBadge}>AI레시피!</span>}
                      {recipe.thumb ? (
                        <Image src={recipe.thumb} alt={recipe.title} fill unoptimized className={styles.recipeImage} />
                      ) : (
                        <div className={styles.recipeImageSkeleton} aria-hidden="true" />
                      )}
                      <BookmarkButton itemId={recipe.id} className={styles.BookmarkButton} imageClassName={styles.BookmarkIcon} />
                    </div>
                  </Link>
                  <div className={styles.recipeTextWrap}>
                    <h2 className={styles.recipeTitle}>
                      <Link href={`/recipes/${recipe.id}`}>{recipe.title}</Link>
                    </h2>
                    <div className={styles.recipeMeta}>
                      <span className={`${styles.recipeMetaView} ${styles.recipeMetaBadge}`}>{recipe.views ?? 0}</span>
                      {(recipe.review?.[0]?.count ?? 0) > 0 &&
                        (<span className={`${styles.recipeMetaComment} ${styles.recipeMetaBadge}`}>{recipe.review?.[0]?.count ?? 0}</span>)}
                    </div>
                  </div>
                </article>
              ))}
          </div>
        </section>

        <FloatingButton />
        <BottomNav activeTab="recipes" />
      </div>
    </main>
  );
}
