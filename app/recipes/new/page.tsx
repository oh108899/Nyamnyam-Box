"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";
import OptionSection from "../../components/write/OptionSection";
import WriteTabs from "../../components/write/WriteTabs";
import styles from "./page.module.css";
import { createClient } from "../../utils/supabase/client";

type TabType = "manual" | "ai";
type Difficulty = "전체" | "상" | "중" | "하";
type Time = "15분 이내" | "30분 이내" | "60분 이내" | "60분 이상";
type Serving = "1인분" | "2인분" | "3인분" | "4인분";

type Ingredient = {
  id: number;
  name: string;
  qty: string;
};

type Step = {
  id: number;
  description: string;
  imageFile: File | null;
  imagePreview: string;
};

export default function WritePage() {
  const supabase = createClient();
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);

  const [activeTab, setActiveTab] = useState<TabType>("manual");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState<Difficulty>("전체");
  const [time, setTime] = useState<Time>("15분 이내");
  const [serving, setServing] = useState<Serving>("1인분");
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState("");

  const [aiTitle, setAiTitle] = useState("");
  const [aiDifficulty, setAiDifficulty] = useState<Difficulty>("전체");
  const [aiTime, setAiTime] = useState<Time>("15분 이내");
  const [aiServing, setAiServing] = useState<Serving>("1인분");

  const [ingredients, setIngredients] = useState<Ingredient[]>([{ id: 1, name: "", qty: "" }]);
  const [steps, setSteps] = useState<Step[]>([{ id: 1, description: "", imageFile: null, imagePreview: "" }]);

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        alert("로그인이 필요한 페이지입니다. 로그인 페이지로 이동합니다.");
        router.replace("/login");
        return;
      }

      setAuthChecked(true);
    };

    checkUser();
  }, [router, supabase]);

  const addIngredient = () => {
    setIngredients((prev) => [...prev, { id: Date.now(), name: "", qty: "" }]);
  };

  const removeIngredient = (id: number) => {
    setIngredients((prev) => prev.filter((item) => item.id !== id));
  };

  const addStep = () => {
    setSteps((prev) => [...prev, { id: Date.now(), description: "", imageFile: null, imagePreview: "" }]);
  };

  const removeStep = (id: number) => {
    setSteps((prev) => prev.filter((item) => item.id !== id));
  };

  const handleCoverChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
  };

  const handleStepImageChange = (stepId: number, e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setSteps((prev) =>
      prev.map((step) =>
        step.id === stepId
          ? {
            ...step,
            imageFile: file,
            imagePreview: previewUrl,
          }
          : step,
      ),
    );
  };

  const handleSubmit = async () => {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error(userError);
      router.push("/login");
      return;
    }

    let thumbUrl = "";
    if (coverFile) {
      const ext = coverFile.name.split(".").pop() || "jpg";
      const coverPath = `${user.id}/cover-${Date.now()}.${ext}`;
      const { error: coverUploadError } = await supabase.storage.from("thumb").upload(coverPath, coverFile, {
        upsert: true,
      });

      if (coverUploadError) {
        console.error(coverUploadError);
        return;
      }

      const { data: coverUrlData } = supabase.storage.from("thumb").getPublicUrl(coverPath);
      thumbUrl = coverUrlData.publicUrl;
    }

    const recipePayload =
      activeTab === "manual"
        ? {
            title: title,
            desc: description,
            thumb: thumbUrl,
            difficulty: difficulty,
            cooking_time: time,
            serving: serving,
            is_AI: false,
            user_id: user.id,
          }
        : {
            title: aiTitle,
            desc: "",
            thumb: thumbUrl,
            difficulty: aiDifficulty,
            cooking_time: aiTime,
            serving: aiServing,
            is_AI: true,
            user_id: user.id,
          };

    const { data: savedRecipe, error: recipeError } = await supabase
      .from("recipes")
      .insert(recipePayload)
      .select("id")
      .single();

    if (recipeError || !savedRecipe) {
      console.error(recipeError);
      return;
    }

    if (activeTab === "manual") {
      const ingredientRows = ingredients
        .filter((item) => item.name.trim() && item.qty.trim())
        .map((item) => ({
          recipe_id: savedRecipe.id,
          name: item.name.trim(),
          qty: item.qty.trim(),
        }));

      if (ingredientRows.length > 0) {
        const { error: ingredientError } = await supabase.from("ingredients").insert(ingredientRows);

        if (ingredientError) {
          console.error(ingredientError);
          return;
        }
      }

      const filteredSteps = steps.filter((step) => step.description.trim());
      const stepRows: Array<{ recipe_id: number; step_num: number; content: string; img_url: string }> = [];

      for (let index = 0; index < filteredSteps.length; index += 1) {
        const step = filteredSteps[index];
        let stepImageUrl = "";

        if (step.imageFile) {
          const ext = step.imageFile.name.split(".").pop() || "jpg";
          const stepPath = `${user.id}/${savedRecipe.id}/step-${index + 1}-${Date.now()}.${ext}`;
          const { error: stepUploadError } = await supabase.storage.from("steps").upload(stepPath, step.imageFile, {
            upsert: true,
          });

          if (stepUploadError) {
            console.error(stepUploadError);
            return;
          }

          const { data: stepUrlData } = supabase.storage.from("steps").getPublicUrl(stepPath);
          stepImageUrl = stepUrlData.publicUrl;
        }

        stepRows.push({
          recipe_id: savedRecipe.id,
          step_num: index + 1,
          content: step.description.trim(),
          img_url: stepImageUrl,
        });
      }

      if (stepRows.length > 0) {
        const { error: stepError } = await supabase.from("recipe-steps").insert(stepRows);

        if (stepError) {
          console.error(stepError);
          return;
        }
      }
    }

    router.push(`/recipes/${savedRecipe.id}`);
  };

  if (!authChecked) {
    return null;
  }

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

        <WriteTabs
          activeTab={activeTab}
          onChange={setActiveTab}
          tabBarClassName={styles.tabBar}
          tabButtonClassName={styles.tabButton}
          tabButtonActiveClassName={styles.tabButtonActive}
        />

        <div className={styles.coverWrap}>
          {coverPreview && (
            <div className={styles.coverPreview}>
              <Image src={coverPreview} alt="커버 이미지 미리보기" fill className={styles.previewImage} />
            </div>
          )}

          <label htmlFor="cover-upload" className={styles.coverUpload}>
            <Image src="/images/addphoto.svg" alt="" width={26} height={26} aria-hidden="true" />
            <span>{coverFile ? "커버 사진 변경" : "커버 사진 추가"}</span>
          </label>
          <input
            id="cover-upload"
            type="file"
            accept="image/*"
            onChange={handleCoverChange}
            className={styles.hiddenFileInput}
          />
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

              <OptionSection
                title="난이도"
                options={["전체", "상", "중", "하"]}
                selected={difficulty}
                onSelect={(value) => setDifficulty(value as Difficulty)}
                sectionClassName={styles.section}
                titleClassName={styles.selectSectionTitle}
                optionWrapClassName={styles.optionWrap}
                optionButtonClassName={styles.optionButton}
                optionButtonActiveClassName={styles.optionButtonActive}
              />
              <OptionSection
                title="소요 시간"
                options={["15분 이내", "30분 이내", "60분 이내", "60분 이상"]}
                selected={time}
                onSelect={(value) => setTime(value as Time)}
                sectionClassName={styles.section}
                titleClassName={styles.selectSectionTitle}
                optionWrapClassName={styles.optionWrap}
                optionButtonClassName={styles.optionButton}
                optionButtonActiveClassName={styles.optionButtonActive}
              />
              <OptionSection
                title="재료 기준"
                options={["1인분", "2인분", "3인분", "4인분"]}
                selected={serving}
                onSelect={(value) => setServing(value as Serving)}
                sectionClassName={styles.section}
                titleClassName={styles.selectSectionTitle}
                optionWrapClassName={styles.optionWrap}
                optionButtonClassName={styles.optionButton}
                optionButtonActiveClassName={styles.optionButtonActive}
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
                        value={item.qty}
                        onChange={(e) =>
                          setIngredients((prev) =>
                            prev.map((ingredient) => (ingredient.id === item.id ? { ...ingredient, qty: e.target.value } : ingredient)),
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
                        <label htmlFor={`step-image-${step.id}`} className={styles.stepImageButton}>
                          {step.imagePreview ? (
                            <Image src={step.imagePreview} alt={`요리 순서 ${index + 1} 이미지`} fill className={styles.previewImage} />
                          ) : (
                            <>
                              <Image src="/images/addphoto.svg" alt="" width={24} height={24} aria-hidden="true" />
                              <span>사진 추가</span>
                            </>
                          )}
                        </label>
                        <input
                          id={`step-image-${step.id}`}
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleStepImageChange(step.id, e)}
                          className={styles.hiddenFileInput}
                        />
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

              <OptionSection
                title="난이도"
                options={["전체", "상", "중", "하"]}
                selected={aiDifficulty}
                onSelect={(value) => setAiDifficulty(value as Difficulty)}
                sectionClassName={styles.section}
                titleClassName={styles.selectSectionTitle}
                optionWrapClassName={styles.optionWrap}
                optionButtonClassName={styles.optionButton}
                optionButtonActiveClassName={styles.optionButtonActive}
              />
              <OptionSection
                title="소요 시간"
                options={["15분 이내", "30분 이내", "60분 이내", "60분 이상"]}
                selected={aiTime}
                onSelect={(value) => setAiTime(value as Time)}
                sectionClassName={styles.section}
                titleClassName={styles.selectSectionTitle}
                optionWrapClassName={styles.optionWrap}
                optionButtonClassName={styles.optionButton}
                optionButtonActiveClassName={styles.optionButtonActive}
              />
              <OptionSection
                title="재료 기준"
                options={["1인분", "2인분", "3인분", "4인분"]}
                selected={aiServing}
                onSelect={(value) => setAiServing(value as Serving)}
                sectionClassName={styles.section}
                titleClassName={styles.selectSectionTitle}
                optionWrapClassName={styles.optionWrap}
                optionButtonClassName={styles.optionButton}
                optionButtonActiveClassName={styles.optionButtonActive}
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
