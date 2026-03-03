/*
Page: 로그인,회원가입 페이지
담당자: 김진선
역할: 로그인, 회원가입 페이지 구현
*/

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../utils/supabase/client";
import BottomNav from "../components/BottomNav";
import styles from "./page.module.css";


export default function Login() {
  const router = useRouter();
  const supabase = createClient();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loginCheck = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        router.replace("/my");
      }
    };

    loginCheck();
  }, [router, supabase.auth]);

  const handleSocialLogin = async (provider: "google" | "kakao") => {
    setIsLoading(true);

    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/my`,
        queryParams: {
          prompt: "consent select_account", // 계정 선택 + 동의 창 표시
        }
      },
    });

    if (error) {
      alert(`로그인 실패: ${error.message}`);
      setIsLoading(false);
    }
  };

  return (
    <main className={styles.viewport}>
      <div className={styles.page}>
        <header className={styles.header}>
          <Link href="/" className={`${styles.headerButton} ${styles.headerIconBack}`} aria-label="뒤로가기" />
          <h1 className={styles.headerTitle}>마이페이지</h1>
        </header>

        <section className={styles.login}>
          <div className={styles.loginLogo} aria-label="냠냠박스 로고">
          </div>
          <p className={styles.loginText}>SNS 계정으로 간편 로그인</p>

          <div className={styles.loginWrap}>

            {/* 카카오 */}
            <button
              onClick={() => handleSocialLogin("kakao")}
              disabled={isLoading}
              className={`${styles.loginCommon} ${styles.loginKakao}`}
              aria-label="카카오 아이디로 로그인"
            >
            </button>

            {/* 구글 */}
            <button
              onClick={() => handleSocialLogin("google")}
              disabled={isLoading}
              className={`${styles.loginCommon} ${styles.loginGoogle}`}
              aria-label="구글 아이디로 로그인"
            >
            </button>

          </div>
        </section>


        <BottomNav activeTab="my" />
      </div>
    </main>
  );
}
