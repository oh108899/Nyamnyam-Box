/*
Page: 레시피 상세 페이지
담당자: 오세찬
역할: 레시피 상세 페이지 구현
*/

import Image from "next/image";
import Link from "next/link";
import CommentClient from "../../components/recipes/CommentClient";
import { createClient } from "../../utils/supabase/client";
import RecipeHeaderActions from './../../components/recipes/RecipeHeaderActions';
import styles from "./page.module.css";

type IngredientRow = {
  id: number;
  name: string;
  qty: string;
};

type StepRow = {
  id: number;
  step_num: number;
  content: string;
  img_url: string | null;
};
export async function generateMetadata({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { id } = params;

  const { data: recipe } = await supabase
    .from("recipes")
    .select("title, desc")
    .eq("id", id)
    .single();

  if (!recipe) {
    return {
      title: "레시피를 찾을 수 없습니다",
    };
  }

  return {
  title: recipe.title,
  description: recipe.desc,
  openGraph: {
    title: recipe.title,
    description: recipe.desc,
    images: recipe.thumb ? [recipe.thumb] : [],
  },
};
}

export default async function RecipePages({ params }: { params: Promise<{ id: string }> }) {
  const supabase = createClient();

  const { id } = await params;
  const { data: recipe, error } = await supabase
    .from("recipes")
    .select()
    .eq("id", id)
    .single();

  if (error || !recipe) {
    return (
      <main className={styles.viewport}>
        <div className={styles.page}>
          <header className={styles.header}>
            <Link href="/" className={styles.headerButton} aria-label="뒤로가기">
              <Image src="/images/back.svg" alt="" width={20} height={19} />
            </Link>
            <h1 className={styles.headerTitle}>레시피를 찾을 수 없습니다</h1>
          </header>
        </div>
      </main>
    );
  }

  const { data: ingredients } = await supabase
    .from("ingredients")
    .select()
    .eq("recipe_id", id);

  const { data: steps } = await supabase
    .from("recipe-steps")
    .select()
    .eq("recipe_id", id)
    .order("step_num", { ascending: true });

  const ingredientRows = (ingredients ?? []) as IngredientRow[];
  const stepRows = (steps ?? []) as StepRow[];

  return (
    <main className={styles.viewport}>
      <div className={styles.page}>
        <header className={styles.header}>
          <Link href="/" className={styles.headerButton} aria-label="뒤로가기">
            <Image src="/images/back.svg" alt="" width={20} height={19} />
          </Link>
          <h1 className={styles.headerTitle}>{recipe.title}</h1>
          <RecipeHeaderActions recipeId={String(recipe.id)} recipeUserId={recipe.user_id} className={styles.recipeEditDel} />

          {/* 내 게시물 아니면 북마크, 로그인 후 내 게시물이면 수정, 삭제 버튼*/}
        </header>

        <section className={styles.section}>
          <figure className={styles.detailTumbnail}>
            {recipe.is_AI && <span className={styles.aiBadge}>AI레시피!</span>}
            {recipe.thumb ? (
              <Image
                src={recipe.thumb}
                alt={recipe.title}
                fill
                sizes="(max-width: 768px) 100vw, 375px"
                unoptimized
                className={styles.detailThumbImage}
              />
            ) : (
              "이미지가 없습니다"
            )}
          </figure>
          <div className={`${styles.detailMenu} ${styles.detailContainer}`}>
            <div className={styles.detailMenuName}>
              <h2 className={styles.detailTitle}>{recipe.title}</h2>
              <button className={styles.shareIcon}>
                <Image src="/images/share.svg" alt="" width={16} height={16} aria-label="공유하기버튼" />
              </button>
            </div>
            <p className={styles.detailBody1}>{recipe.desc}</p>
          </div>
          <div className={`${styles.detailQuick} ${styles.detailContainer}`}>
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
                <p className={styles.detailDesc}>{recipe.serving}</p>
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
                <p className={styles.detailDesc}>{recipe.cooking_time}</p>
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
                <p className={styles.detailDesc}>{recipe.difficulty}</p>
              </li>

            </ul>
          </div>

          <div className={`${styles.detailContainer}`}>
            <h2 className={styles.detailTitle}>필수재료</h2>
            <div className={styles.detailIngredient}>
              <ul>
                {ingredientRows.length ? (
                  ingredientRows.map((item) => (
                    <li className={styles.detailBody2} key={item.id}>
                      <span>{item.name}</span>
                      <strong>{item.qty}</strong>
                    </li>
                  ))
                ) : (
                  <li className={styles.detailBody2}>
                    <span>등록된 재료가 없습니다.</span>
                  </li>
                )}
              </ul>
            </div>
          </div>

          <div className={`${styles.detailContainer}`}>
            <h2 className={styles.detailTitle}>요리순서</h2>
            <div className={styles.detailStep}>
              <ul>
                {stepRows.length ? (
                  stepRows.map((step) => (
                    <li key={step.id}>
                      <div className={styles.stepNum}>{step.step_num}</div>
                      <div className={styles.stepBox}>
                        <p className={`${styles.detailBody1} ${styles.detailBold}`}>STEP {step.step_num}</p>
                        <p className={`${styles.detailBody1} ${styles.stepContent}`}>{step.content}</p>
                        {step.img_url?.trim() ? (
                          <figure className={styles.setpImage}>
                            <Image
                              src={step.img_url}
                              alt={`요리순서 ${step.step_num}`}
                              width={304}
                              height={171}
                              sizes="(max-width: 768px) 100vw, 375px"
                              unoptimized
                            />
                          </figure>
                        ) : null}
                      </div>
                    </li>
                  ))
                ) : (
                  <li>
                    <div className={styles.stepBox}>
                      <p className={styles.detailBody1}>등록된 요리 순서가 없습니다.</p>
                    </div>
                  </li>
                )}
              </ul>

            </div>
          </div>

          <div className={styles.detailContainer}>
            <h2 className={styles.detailTitle}>댓글</h2>
            <CommentClient
              recipeId={Number(id)}
              classNames={{
                commentsWrap: styles.commentsWrap,
                commentsProfile: styles.commentsProfile,
                commentsBox: styles.commentsBox,
                commentsUser: styles.commentsUser,
                commentsId: styles.commentsId,
                commentsMy: styles.commentsMy,
                commentsDel: styles.commentsDel,
                commentsEdit: styles.commentsEdit,
                commentsContext: styles.commentsContext,
                commentsWrite: styles.commentsWrite,
                commentsPreContext: styles.commentsPreContext,
                commentsEditButton: styles.editButton,
                commentsEditButtonCancle: styles.editButtonCancle,
                commentsEditButtonConfirm: styles.editButtonConfirm,
                commentsContent: styles.commentsContent,
              }}
            />
          </div>

        </section>
      </div>
    </main>
  );
}