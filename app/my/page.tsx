// 담당자 김진선

"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { createClient } from "../utils/supabase/client";
import BottomNav from "../components/BottomNav";
import styles from "./page.module.css";

type MyRecipe = {
  id: string;
  image: string;
  thumb: string | null;
  is_AI: boolean;
  title: string;
  views: string;
  likes: string;
  isBest: boolean;
  bookmark: { count: number }[];
};

type Profile = {
  id: string;
  nick_name: string;
  email: string;
  avatar_url: string | null;
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
        router.replace("/login");
        return;
      }
      //프로필
      const { data: profile, error: profileError } = await supabase
        .from("profile")
        .select()
        .eq("id", user.id)
        .single();

      if (profileError) {
        console.error(profileError);
        return;
      } else {
        setProfile(profile);
      }

      //작성레시피+북마크
      const { data: recipes, error: recipesError } = await supabase
        .from("recipes")
        .select("*, bookmark(count)")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (recipesError) {
        console.error(recipesError);
        return;
      } else {
        setMyRecipes(recipes ?? []);
      }

      setLoading(false);
      // console.log(profile);
    };
    fetchProfile();
  }, [router, supabase]);


  const handleLogout = async () => {
    setisLogout(true);

    const { error: logoutError } = await supabase.auth.signOut();

    if (logoutError) {
      alert(`로그아웃 실패: ${logoutError.message}`);
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
            <Image src="/images/back.svg" alt="" width={20} height={19} />
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
              <div className={styles.profileAvatar}>
                <Image
                  src={profile.avatar_url ?? `/images/profilePrm.svg`}
                  width={80}
                  height={80}
                  alt=""
                />
              </div>
                <div className={styles.profileInfo}>
                  <h2 className={styles.profileName}>{profile.nick_name}</h2>
                  <p className={styles.profileMeta}>{profile.email}</p>
                </div>
              </>
            )
          }
        </section>

        <section className={styles.bottomActionWrap}>
          <Link href="/recipes/new" className={styles.bottomActionButton}>
            <Image src="/images/write.svg" alt="" width={19} height={20} aria-hidden="true" />
            레시피 작성하기
          </Link>
        </section>

        <section className={styles.recipeSection}>
          <h3 className={styles.recipeSectionTitle}>작성한 레시피 {!loading && <><span className={styles.myRecipeNum}>{myRecipes.length}</span></>}</h3>

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
                    <Link href={`/recipes/${recipe.id}`}>
                      <div className={styles.recipeImageWrap}>
                        {recipe.is_AI && <span className={styles.aiBadge}>AI레시피!</span>}
                        {recipe.thumb &&
                          <Image
                            src={recipe.thumb}
                            alt={recipe.title}
                            fill className={styles.recipeImage}
                          />}
                        {recipe.isBest && <span className={styles.bestBadge}>Best</span>}
                      </div>
                    </Link>
                    <h4 className={styles.recipeTitle}>{recipe.title}</h4>
                    <div className={styles.recipeMeta}>
                      <span className={`${styles.recipeMetaView} ${styles.recipeMetaBadge}`}>{recipe.views}</span>

                      {(recipe.bookmark?.[0]?.count ?? 0) > 0 &&
                        (<span className={`${styles.recipeMetaBookmark} ${styles.recipeMetaBadge}`}>{recipe.bookmark?.[0]?.count ?? 0}</span>)}
                    </div>
                  </article>

                ))}
          </div>
        </section>

        <BottomNav activeTab="my" />
      </div>
    </main >
  );
}
