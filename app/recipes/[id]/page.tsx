"use client";

import Image from "next/image";
//import { useState } from "react";
import BottomNav from "../../components/BottomNav";
import Link from "next/link";
import styles from "./page.module.css";

export default function RecipePages() {
  //const [loading] = useState(true);
  const DB: Array<{ id: string; src: string; alt: string; title: string; comments: string; time: string }> = [];

  return (
    <main className={styles.viewport}>
      <div className={styles.page}>
        <header className={styles.header}>
          <Link href="/" className={styles.iconButton} aria-label="뒤로가기">
            <span className={`${styles.headerIconBack}`} aria-hidden="true"></span>
            <span className={styles.hidden}>뒤로가기</span>
          </Link>
          <h1 className={styles.headerTitle}>{DB.title}</h1>
          <button className={styles.buttonBg}>
            <p className={styles.bookmarkButton}><span className={styles.hidden}>북마크</span></p>
          </button>
          {/* 내 게시물 아니면 북마크, 로그인 후 내 게시물이면 수정, 삭제 버튼*/}
        </header>

        <section className={styles.section}>
          <figure className={styles.detailTumbnail}>
            <Image
              src=""
              alt=""
              width={375}
              height={320}
            />
          </figure>
          <div className={`${styles.detailMenu} ${styles.detailConainter}`}>
            <div className={styles.detailMenuName}>
              <h2 className={styles.detailTitle}>트러플 오일 버섯 파스타</h2>
              <button className={styles.shareIcon}><span className={styles.hidden}>공유하기 버튼</span></button>
            </div>
            <p className={styles.detailBody1}>풍부한 버섯의 향과 트러플 오일의 고급스러운 조화가 일품인 이탈리아 정통 파스타입니다.</p>
          </div>
          <div className={`${styles.detailQuick} ${styles.detailConainter}`}>
            <ul>
              <li>
                <figure>
                  <Image
                    src="/images/people.svg"
                    alt="인분"
                    width={20}
                    height={14}
                  />
                </figure>
                <p className={styles.detailDesc}>2인분</p>
              </li>
              <li>
                <figure>
                  <Image
                    src="/images/cookTime.svg"
                    alt="조리시간"
                    width={20}
                    height={20}
                  />
                </figure>
                <p className={styles.detailDesc}>30분내</p>
              </li>
              <li>
                <figure>
                  <Image
                    src="/images/level.svg"
                    alt="난이도"
                    width={20}
                    height={20}
                  />
                </figure>
                <p className={styles.detailDesc}>하</p>
              </li>

            </ul>
          </div>

          <div className={`${styles.detailConainter}`}>
            <h2 className={styles.detailTitle}>필수재료</h2>
            <div className={styles.detailIngredient}>
              <ul>
                <li className={styles.detailBody2}>
                  <span>파스타 면(링귀네)</span><strong>200g</strong>
                </li>
                <li className={styles.detailBody2}>
                  <span>모둠 버섯(양송이, 표고)</span><strong>150g</strong>
                </li>
                <li className={styles.detailBody2}>
                  <span>트러플 오일</span><strong>2큰술</strong>
                </li>
              </ul>
              {/* DB.map((item) => <li className={styles.detailBody2} key={item.id}>
                  <span>{item.ingredientName}</span><strong>{item.ingredientAmount}</strong>
                </li>))*/}
            </div>
          </div>

          <div className={`${styles.detailConainter}`}>
            <h2 className={styles.detailTitle}>요리순서</h2>
            <div className={styles.detailStep}>
              <ul>
                <li>
                  <div className={styles.stepNum}>1</div>
                  <div className={styles.stepBox}>
                    <p className={`${styles.detailBody1} ${styles.detailBold}`}>면 삶기</p>
                    <p className={styles.detailBody1}>끓는 물에 소금 1큰술을 넣고 파스타 면을 8분간 삶아주세요. 면수는 1컵 정도 남겨둡니다.</p>
                    <figure className={styles.setpImage}>
                      <Image
                        src=""
                        alt="dummy"
                        width={304}
                        height={160}
                      />
                    </figure>

                  </div>
                </li>

                <li>
                  <div className={styles.stepNum}>2</div>
                  <div className={styles.stepBox}>
                    <p className={`${styles.detailBody1} ${styles.detailBold}`}>재료 손질</p>
                    <p className={styles.detailBody1}>마늘은 편으로 썰고, 버섯은 먹기 좋은 크기로 썰어서 준비합니다.</p>
                    <figure className={styles.setpImage}>
                      <Image
                        src=""
                        alt="dummy"
                        width={304}
                        height={160}
                      />
                    </figure>

                  </div>
                </li>
              </ul>

            </div>
          </div>

          <div className={`${styles.detailConainter}`}>
            <h2 className={styles.detailTitle}>댓글</h2>
            <div className={styles.commentsWrap}>
              

            </div>
          </div>

        </section>

        <BottomNav activeTab="recipes" />
      </div>
    </main>
  );
}
