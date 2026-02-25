"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import BottomNav from "../components/BottomNav";
import { createClient } from "../utils/supabase/client";
import styles from "./page.module.css";

type MyRecipe = {
  id: string;
  image: string;
  title: string;
  views: string;
  likes: string;
  isBest: boolean;
};

type Profile = {
  id: string;
  nick_name: string;
  email: string;
}

export default function MyPage() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [isLogout, setisLogout] = useState(false);
  const [myRecipes, setMyRecipes] = useState<MyRecipe[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);

      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }
      //프로필
      const { data: profile, error } = await supabase
        .from("profile")
        .select()
        .eq("id", user.id)
        .single();
      
      if (error) {
        console.error(error);
        return;
      }
      setProfile(profile);
      setLoading(false);
      // console.log(profile);
    };
    fetchProfile();
  }, []);


const handleLogout = async () => {
  setisLogout(true);

  const { error } = await supabase.auth.signOut();

  if (error) {
    alert(`로그아웃 실패: ${error.message}`);
    setisLogout(false);
    return;
  }

  router.replace("/login");
};



return (
  <main className={styles.viewport}>
    <div className={styles.page}>
      <header className={styles.header}>
        <Link href="/" className={styles.headerButton} aria-label="뒤로가기">
          <span className={styles.headerIcon}>←</span>
        </Link>

        <h1 className={styles.headerTitle}>마이페이지</h1>

        <button
          type="button"
          className={styles.logoutButton}
          onClick={handleLogout}
          disabled={isLogout}
          aria-label="로그아웃"
        >
          로그아웃
        </button>
      </header>


      <section className={styles.profileSection}>
        {loading
          ? (<>
            <div className={styles.profileAvatarSkeleton} aria-hidden="true" />
            <div className={styles.profileInfo}>
              <div className={styles.profileNameSkeleton} aria-hidden="true" />
              <div className={styles.profileMetaSkeleton} aria-hidden="true" />
              <div className={styles.profileDescSkeleton} aria-hidden="true" />
            </div>
          </>)
          : profile &&
          (
            <>
              <div className={styles.profileAvatar} />
              <div className={styles.profileInfo}>
                <h2 className={styles.profileName}>{profile.nick_name}</h2>
                <p className={styles.profileMeta}>{profile.email}</p>
              </div>
            </>
          )
        }
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
                <p className={styles.emptyText}>아직 작성한 레시피가 없습니다</p>
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
