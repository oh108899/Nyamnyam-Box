import Image from "next/image";
import Link from "next/link";
import CommentActions, { CommentWriteButton } from "../../components/recipes/CommentActions";
import styles from "./page.module.css";
import { createClient } from '@/utils/supabase/client';

export default async function RecipePages({ params }: { params: Promise<{ id: string }> }) {
  const supabase = createClient();
  const { id } = await params;
  const {data:recipe ,error} = await supabase
  .from("recipes")
  .select()
  .eq('id', id)
  .single();

  if (error || !recipe) {
    return (
      <main className={styles.viewport}>
        <div className={styles.page}>
          <header className={styles.header}>
            <Link href="/" className={styles.iconButton} aria-label="뒤로가기">
              <span className={`${styles.headerIconBack}`} aria-hidden="true"></span>
              <span className={styles.hidden}>뒤로가기</span>
            </Link>
            <h1 className={styles.headerTitle}>레시피를 찾을 수 없습니다</h1>
            <button className={styles.buttonBg}>
              <p className={styles.bookmarkButton}><span className={styles.hidden}>북마크</span></p>
            </button>
            {/* 내 게시물 아니면 북마크, 로그인 후 내 게시물이면 수정, 삭제 버튼*/}
          </header>
        </div>
      </main>
    );
  }

  const {data: ingredients} = await supabase
  .from("ingredients")
  .select()
  .eq('recipe_id', id);

  const{data: steps} = await supabase
  .from("steps")
  .select()
  .eq('recipe_id', id);


  
  return (
    <main className={styles.viewport}>
      <div className={styles.page}>
        <header className={styles.header}>
          <Link href="/" className={styles.iconButton} aria-label="뒤로가기">
            <span className={`${styles.headerIconBack}`} aria-hidden="true"></span>
            <span className={styles.hidden}>뒤로가기</span>
          </Link>
          <h1 className={styles.headerTitle}>{recipe.title}</h1>
          <button className={styles.buttonBg}>
            <p className={styles.bookmarkButton}><span className={styles.hidden}>북마크</span></p>
          </button>
          {/* 내 게시물 아니면 북마크, 로그인 후 내 게시물이면 수정, 삭제 버튼*/}
        </header>

        <section className={styles.section}>
          <figure className={styles.detailTumbnail}>
            이미지
            {/* <Image
              src=""
              alt=""
              width={375}
              height={320}
            /> */}
          </figure>
          <div className={`${styles.detailMenu} ${styles.detailContainer}`}>
            <div className={styles.detailMenuName}>
              <h2 className={styles.detailTitle}>{recipe.title}</h2>
              <button className={styles.shareIcon}><span className={styles.hidden}>공유하기 버튼</span></button>
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

          <div className={`${styles.detailContainer}`}>
            <h2 className={styles.detailTitle}>요리순서</h2>
            <div className={styles.detailStep}>
              <ul>
                <li>
                  <div className={styles.stepNum}>1</div>
                  <div className={styles.stepBox}>
                    <p className={`${styles.detailBody1} ${styles.detailBold}`}>면 삶기</p>
                    <p className={styles.detailBody1}>끓는 물에 소금 1큰술을 넣고 파스타 면을 8분간 삶아주세요. 면수는 1컵 정도 남겨둡니다.</p>
                    <figure className={styles.setpImage}>
                      {/* <Image
                        src=""
                        alt=""
                        width={304}
                        height={160}
                      /> */}
                    </figure>

                  </div>
                </li>

                <li>
                  <div className={styles.stepNum}>2</div>
                  <div className={styles.stepBox}>
                    <p className={`${styles.detailBody1} ${styles.detailBold}`}>재료 손질</p>
                    <p className={styles.detailBody1}>마늘은 편으로 썰고, 버섯은 먹기 좋은 크기로 썰어서 준비합니다.</p>
                    <figure className={styles.setpImage}>
                      {/* <Image
                        src=""
                        alt=""
                        width={304}
                        height={160}
                      /> */}
                    </figure>

                  </div>
                </li>
              </ul>

            </div>
          </div>

          <div className={`${styles.detailContainer}`}>
            <h2 className={styles.detailTitle}>댓글</h2>
            <div className={styles.commentsWrap}>
              <div className={styles.commentsProfile}>
                <Image
                  src="/images/profilePrm.svg"
                  alt="유저 아이콘"
                  width={40}
                  height={40}
                />
              </div>
              <div className={styles.commentsBox}>
                <div className={styles.commentsUser}>
                  <span className={`${styles.commentsId} ${styles.detailBody1}`}>냠냠박스</span>
                  <div className={styles.commentsMy}>
                    <CommentActions
                      deleteClassName={styles.commentsDel}
                      editClassName={styles.commentsEdit}
                    />
                  </div>
                </div>
                <p className={styles.commentsContext}>
                  넘 맛있어요^^ 만들기도 간단하고 한입 먹자마자 내몸한테 죄스러울 만큼 행복한 맛, ㅎㅎㅎ~
                </p>
              </div>

            </div>
            <div className={styles.commentsWrap}>
              <p className={styles.commentsContext}>
                아직 작성한 댓글이 없습니다
              </p>
            </div>
            <CommentWriteButton writeClassName={styles.commentsWrite} />
          </div>

        </section>
      </div>
    </main>
  );
}
