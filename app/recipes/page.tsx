"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import BottomNav from "../components/BottomNav";
import LogoHeader from "../components/LogoHeader";
import styles from "./page.module.css";

type Recipe = {
  id: number; created_at: string; user_id: string; title: string; desc: string; thumb: string; difficulty: string; cooking_time: string; serving: string
};

export default function RecipesPage() {
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
          <p className={styles.countText}>{loading ? "레시피 로딩중.." : `${recipes.length}개`}</p>

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
                  <div className={styles.recipeImageWrap}>
                    <Image src={recipe.image} alt={recipe.title} fill className={styles.recipeImage} />
                    <button type="button" className={styles.bookmarkButton} aria-label="북마크">
                      <Image src="/images/bookmark.svg" alt="" width={13} height={16} aria-hidden="true" />
                    </button>
                  </div>

                  <h2 className={styles.recipeTitle}>{recipe.title}</h2>
                  <div className={styles.recipeMeta}>
                    <span>
                      <Image src="/images/cookTime.png" alt="" width={12} height={12} aria-hidden="true" />
                      {recipe.time}
                    </span>
                    <span>
                      <Image src="/images/people.svg" alt="" width={12} height={12} aria-hidden="true" />
                      {recipe.comments}
                    </span>
                  </div>
                </article>
              ))}
          </div>
        </section>

        <BottomNav activeTab="recipes" />
      </div>
    </main>
  );
}
