"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import styles from "./page.module.css";

type TabType = "manual" | "ai";
type Difficulty = "전체" | "상" | "중" | "하";
type Time = "15분 이내" | "30분 이내" | "60분 이내" | "60분 이상";
type Serving = "1인분" | "2인분" | "3인분" | "4인분";

type Ingredient = {
  id: number;
  name: string;
  amount: string;
};

type Step = {
  id: number;
  description: string;
};

export default function WritePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>("manual");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState<Difficulty>("전체");
  const [time, setTime] = useState<Time>("15분 이내");
  const [serving, setServing] = useState<Serving>("1인분");

  const [aiTitle, setAiTitle] = useState("");
  const [aiDifficulty, setAiDifficulty] = useState<Difficulty>("전체");
  const [aiTime, setAiTime] = useState<Time>("15분 이내");
  const [aiServing, setAiServing] = useState<Serving>("1인분");

  const [ingredients, setIngredients] = useState<Ingredient[]>([{ id: 1, name: "", amount: "" }]);
  const [steps, setSteps] = useState<Step[]>([{ id: 1, description: "" }]);

  const addIngredient = () => {
    setIngredients((prev) => [...prev, { id: Date.now(), name: "", amount: "" }]);
  };

  const removeIngredient = (id: number) => {
    setIngredients((prev) => prev.filter((item) => item.id !== id));
  };

  const addStep = () => {
    setSteps((prev) => [...prev, { id: Date.now(), description: "" }]);
  };

  const removeStep = (id: number) => {
    setSteps((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSubmit = () => {
    if (activeTab === "manual") {
      console.log({
        title,
        description,
        difficulty,
        time,
        serving,
        ingredients,
        steps,
      });
    } else {
      console.log({
        title: aiTitle,
        difficulty: aiDifficulty,
        time: aiTime,
        serving: aiServing,
      });
    }

    router.push("/my");
  };

  return (
    <main className={styles.viewport}>
      <div className={styles.page}>
        <header className={styles.header}>
          <button type="button" onClick={() => router.back()} className={styles.headerButton} aria-label="뒤로가기">
            <span className={styles.headerIcon}>←</span>
          </button>
          <h1 className={styles.headerTitle}>레시피 작성</h1>
          <button type="button" onClick={handleSubmit} className={styles.completeButton}>
            완료
          </button>
        </header>

        <div className={styles.tabBar}>
          <button
            type="button"
            className={`${styles.tabButton} ${activeTab === "manual" ? styles.tabButtonActive : ""}`}
            onClick={() => setActiveTab("manual")}
          >
            레시피 작성
          </button>
          <button
            type="button"
            className={`${styles.tabButton} ${activeTab === "ai" ? styles.tabButtonActive : ""}`}
            onClick={() => setActiveTab("ai")}
          >
            AI로 레시피 생성하기
          </button>
        </div>

        <div className={styles.coverWrap}>
          <button type="button" className={styles.coverUpload}>
            <Image src="/images/addphoto.svg" alt="" width={26} height={26} aria-hidden="true" />
            <span>커버 사진 추가</span>
          </button>
        </div>

        <section className={styles.content}>
          {activeTab === "manual" ? (
            <>
              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>기본 정보</h2>
                <label className={styles.fieldLabel}>레시피 제목</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="레시피 제목을 설명해 주세요"
                  className={styles.input}
                />
                <label className={styles.fieldLabel}>레시피 설명</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="레시피 설명을 입력 해 주세요"
                  className={styles.textarea}
                />
              </section>

              <SelectSection
                title="난이도"
                options={["전체", "상", "중", "하"]}
                selected={difficulty}
                onSelect={(value) => setDifficulty(value as Difficulty)}
              />
              <SelectSection
                title="소요 시간"
                options={["15분 이내", "30분 이내", "60분 이내", "60분 이상"]}
                selected={time}
                onSelect={(value) => setTime(value as Time)}
              />
              <SelectSection
                title="재료 기준"
                options={["1인분", "2인분", "3인분", "4인분"]}
                selected={serving}
                onSelect={(value) => setServing(value as Serving)}
              />

              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>재료 정보</h2>
                <div className={styles.groupList}>
                  {ingredients.map((item) => (
                    <div key={item.id} className={styles.row}>
                      <input
                        placeholder="요리 재료 입력"
                        className={styles.input}
                        value={item.name}
                        onChange={(e) =>
                          setIngredients((prev) =>
                            prev.map((ingredient) => (ingredient.id === item.id ? { ...ingredient, name: e.target.value } : ingredient)),
                          )
                        }
                      />
                      <input
                        placeholder="1큰술"
                        className={styles.amountInput}
                        value={item.amount}
                        onChange={(e) =>
                          setIngredients((prev) =>
                            prev.map((ingredient) => (ingredient.id === item.id ? { ...ingredient, amount: e.target.value } : ingredient)),
                          )
                        }
                      />
                      <button type="button" onClick={() => removeIngredient(item.id)} className={styles.removeButton}>
                        <span className={styles.materialIcon} aria-hidden="true">
                          remove_circle_outline
                        </span>
                      </button>
                    </div>
                  ))}
                </div>
                <button type="button" onClick={addIngredient} className={styles.outlineButton}>
                  재료 추가
                </button>
              </section>

              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>요리 순서</h2>
                <div className={styles.groupList}>
                  {steps.map((step, index) => (
                    <div key={step.id} className={styles.stepCard}>
                      <div className={styles.stepHeader}>
                        <span className={styles.stepBadge}>STEP {index + 1}</span>
                        <button type="button" onClick={() => removeStep(step.id)} className={styles.stepDeleteButton}>
                          <span className={styles.materialIcon} aria-hidden="true">
                            delete
                          </span>
                          삭제
                        </button>
                      </div>
                      <div className={styles.stepBody}>
                        <textarea
                          value={step.description}
                          onChange={(e) =>
                            setSteps((prev) => prev.map((item) => (item.id === step.id ? { ...item, description: e.target.value } : item)))
                          }
                          placeholder="요리 순서 입력"
                          className={styles.stepTextarea}
                        />
                        <button type="button" className={styles.stepImageButton}>
                          <Image src="/images/addphoto.svg" alt="" width={24} height={24} aria-hidden="true" />
                          <span>사진 추가</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <button type="button" onClick={addStep} className={styles.outlineButton}>
                  요리 순서 추가
                </button>
              </section>
            </>
          ) : (
            <>
              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>기본 정보</h2>
                <label className={styles.fieldLabel}>레시피 제목</label>
                <input
                  value={aiTitle}
                  onChange={(e) => setAiTitle(e.target.value)}
                  placeholder="레시피 제목을 설명해 주세요"
                  className={styles.input}
                />
              </section>

              <SelectSection
                title="난이도"
                options={["전체", "상", "중", "하"]}
                selected={aiDifficulty}
                onSelect={(value) => setAiDifficulty(value as Difficulty)}
              />
              <SelectSection
                title="소요 시간"
                options={["15분 이내", "30분 이내", "60분 이내", "60분 이상"]}
                selected={aiTime}
                onSelect={(value) => setAiTime(value as Time)}
              />
              <SelectSection
                title="재료 기준"
                options={["1인분", "2인분", "3인분", "4인분"]}
                selected={aiServing}
                onSelect={(value) => setAiServing(value as Serving)}
              />
            </>
          )}
        </section>

        <div className={styles.bottomActionWrap}>
          <Link href="/recipes" className={styles.cancelButton}>
            작성 취소
          </Link>
          <button type="button" className={styles.bottomActionButton} onClick={handleSubmit}>
            {activeTab === "manual" ? "레시피 작성 완료" : "AI 레시피 생성"}
          </button>
        </div>
      </div>
    </main>
  );
}

interface SelectSectionProps {
  title: string;
  options: string[];
  selected: string;
  onSelect: (value: string) => void;
}

function SelectSection({ title, options, selected, onSelect }: SelectSectionProps) {
  return (
    <section className={styles.section}>
      <h2 className={styles.selectSectionTitle}>{title}</h2>
      <div className={styles.optionWrap}>
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onSelect(option)}
            className={`${styles.optionButton} ${selected === option ? styles.optionButtonActive : ""}`}
          >
            {option}
          </button>
        ))}
      </div>
    </section>
  );
}
