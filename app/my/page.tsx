"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import BottomNav from "../components/BottomNav";
import styles from "./page.module.css";

type MyRecipe = {
  id: string;
  image: string;
  title: string;
  views: string;
  likes: string;
  isBest: boolean;
};

export default function MyPage() {
  const [loading] = useState(true);
  const myRecipes: MyRecipe[] = [];

  return (
    <main className={styles.viewport}>
      <div className={styles.page}>
        <header className={styles.header}>
          <Link href="/" className={styles.headerButton} aria-label="뒤로가기">
            <span className={styles.headerIcon}>←</span>
          </Link>

          <h1 className={styles.headerTitle}>마이페이지</h1>

          <button type="button" className={styles.headerButton} aria-label="설정">
            <Image src="/images/option.svg" alt="" width={20} height={20} aria-hidden="true" />
          </button>
        </header>

        <section className={styles.profileSection}>
          {loading ? (
            <>
              <div className={styles.profileAvatarSkeleton} aria-hidden="true" />
              <div className={styles.profileInfo}>
                <div className={styles.profileNameSkeleton} aria-hidden="true" />
                <div className={styles.profileMetaSkeleton} aria-hidden="true" />
                <div className={styles.profileDescSkeleton} aria-hidden="true" />
              </div>
            </>
          ) : (
            <>
              <div className={styles.profileAvatar} />
              <div className={styles.profileInfo}>
                <h2 className={styles.profileName}>요리조리</h2>
                <div className={styles.profileMeta}>레시피 24개 • 팔로워 1.2k</div>
                <p className={styles.profileDesc}>집에서 즐기는 간단한 요리들을 공유합니다.</p>
              </div>
            </>
          )}
        </section>

        <section className={styles.recipeSection}>
          <h3 className={styles.recipeSectionTitle}>작성한 레시피</h3>

          <div className={styles.recipeGrid}>
            {loading
              ? Array.from({ length: 4 }, (_, index) => (
                  <article key={`my-skeleton-${index}`} className={styles.recipeCard}>
                    <div className={styles.recipeImageSkeleton} aria-hidden="true" />
                    <div className={styles.recipeTitleSkeleton} aria-hidden="true" />
                    <div className={styles.recipeMetaSkeleton} aria-hidden="true" />
                  </article>
                ))
              : myRecipes.length === 0
                ? (
                    <p className={styles.emptyText}>작성한 레시피가 없습니다...</p>
                  )
                : myRecipes.map((recipe) => (
                  <article key={recipe.id} className={styles.recipeCard}>
                    <div className={styles.recipeImageWrap}>
                      <Image src={recipe.image} alt={recipe.title} fill className={styles.recipeImage} />
                      {recipe.isBest && <span className={styles.bestBadge}>Best</span>}
                    </div>
                    <h4 className={styles.recipeTitle}>{recipe.title}</h4>
                    <div className={styles.recipeMeta}>
                      <span>👁 {recipe.views}</span>
                      <span>❤️ {recipe.likes}</span>
                    </div>
                  </article>
                ))}
          </div>
        </section>

        <div className={styles.bottomActionWrap}>
          <Link href="/recipes/new" className={styles.bottomActionButton}>
            <Image src="/images/write.svg" alt="" width={19} height={20} aria-hidden="true" />
            레시피 작성하기
          </Link>
        </div>

        <BottomNav activeTab="my" />
      </div>
    </main>
  );
}
