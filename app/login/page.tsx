"use client";

import Link from "next/link";
import { useState } from "react";
import { createClient } from "../utils/supabase/client";
import BottomNav from "../components/BottomNav";
import styles from "./page.module.css";


export default function Login() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSocialLogin = async (provider: "google" | "kakao") => {
    setIsLoading(true);

    const supabase = createClient();

    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `http://localhost:3000/my`,
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
          <Link href="/" className={styles.headerButton} aria-label="뒤로가기">
            <span className={styles.headerIcon}>←</span>
          </Link>

          <h1 className={styles.headerTitle}>마이페이지</h1>

        </header>

        <section className={styles.login}>
          <div className={styles.loginLogo} aria-label="냠냠박스 로고">
          </div>
          <p className={styles.loginText}>SNS 계정으로 간편 로그인</p>

          <div className={styles.loginWrap}>

            {/* 네이버 */}
            <button
              type="button"
              disabled
              className={`${styles.loginCommon} ${styles.loginNaver}`}
              aria-label="네이버 아이디로 로그인"
            >
            </button>

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
