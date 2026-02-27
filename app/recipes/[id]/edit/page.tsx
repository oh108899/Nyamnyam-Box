"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";
import OptionSection from "../../../components/write/OptionSection";
import styles from "../../new/page.module.css";
import { createClient } from "../../../utils/supabase/client";
import { useParams } from "next/navigation";

type Recipe = {
  id: number;
  title: string;
  thumb: string | null;
  is_AI: boolean;
  views: number | null;
  review: { count: number }[] | null;
};

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

export default function RecipeEditPage() {
  const supabase = createClient();
  const router = useRouter();
  const params = useParams();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState<Difficulty>("전체");
  const [time, setTime] = useState<Time>("15분 이내");
  const [serving, setServing] = useState<Serving>("1인분");
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState("");

  const [ingredients, setIngredients] = useState<Ingredient[]>([{ id: 1, name: "", qty: "" }]);
  const [steps, setSteps] = useState<Step[]>([{ id: 1, description: "", imageFile: null, imagePreview: "" }]);

  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const getRecipe = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const { data: recipe, error } = await supabase
        .from("recipes")
        .select()
        .eq("id", params.id)
        .single();

      const { data: ingredients } = await supabase
        .from("ingredients")
        .select()
        .eq("recipe_id", params.id);

      const { data: steps } = await supabase
        .from("recipe-steps")
        .select()
        .eq("recipe_id", params.id)
        .order("step_num", { ascending: true });

      if (error || !recipe) {
        alert("레시피를 찾을 수 없습니다. 레시피 목록 페이지로 이동합니다.");
        router.replace("/recipes");
        return;
      }

      if (user?.id !== recipe.user_id) {
        alert("이 레시피를 수정할 권한이 없습니다. 레시피 목록 페이지로 이동합니다.");
        router.replace("/recipes");
        return;
      }
      setRecipe(recipe);
      setTitle(recipe.title);
      setDescription(recipe.desc);
      setDifficulty(recipe.difficulty as Difficulty);
      setTime(recipe.cooking_time as Time);
      setServing(recipe.serving as Serving);
      if (recipe.thumb) {
        setCoverPreview(recipe.thumb);
      }
      if (ingredients) {
        setIngredients(
          ingredients.map((item) => ({
            id: item.id,
            name: item.name,
            qty: item.qty,
          })),
        );
      }
      if (steps) {
        setSteps(
          steps.map((item) => ({
            id: item.id,
            description: item.content,
            imageFile: null,
            imagePreview: item.img_url ?? "",
          })),
        );
      }

    }
    getRecipe();

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
    if (!recipe) return;
    if (submitting) return;

    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();

    if (!trimmedTitle) {
      alert("레시피 제목을 입력해주세요.");
      return;
    }

    if (!trimmedDescription) {
      alert("레시피 설명을 입력해주세요.");
      return;
    }

    if (ingredients.length === 0 || ingredients.some((item) => !item.name.trim() || !item.qty.trim())) {
      alert("재료명과 양을 빈칸 없이 모두 입력해주세요.");
      return;
    }

    if (steps.length === 0 || steps.some((step) => !step.description.trim())) {
      alert("요리 순서를 빈칸 없이 모두 입력해주세요.");
      return;
    }

    const ingredientRows = ingredients.map((item) => ({
      recipe_id: recipe.id,
      name: item.name.trim(),
      qty: item.qty.trim(),
    }));

    const stepRows = steps.map((item, index) => ({
      recipe_id: recipe.id,
      step_num: index + 1,
      content: item.description.trim(),
      img_url: item.imagePreview,
    }));

    setSubmitting(true);
    const { error: updateError } = await supabase
      .from("recipes")
      .update({
        title: trimmedTitle,
        desc: trimmedDescription,
        difficulty: difficulty,
        cooking_time: time,
        serving: serving,
        thumb: coverPreview,
      })
      .eq("id", recipe.id);

    const { error: ingredientDelError } = await supabase
      .from("ingredients")
      .delete()
      .eq("recipe_id", recipe.id);
    const { error: ingredientError } = await supabase
      .from("ingredients")
      .insert(ingredientRows)

    const { error: stepDelError } = await supabase
      .from("recipe-steps")
      .delete()
      .eq("recipe_id", recipe.id);

    const { error: stepError } = await supabase
      .from("recipe-steps")
      .insert(stepRows);

    if (updateError || ingredientDelError || ingredientError || stepDelError || stepError) {
      console.error("레시피 업데이트 중 오류 발생:", updateError, ingredientDelError, ingredientError, stepDelError, stepError);
      alert("레시피 업데이트에 실패했습니다. 다시 시도해주세요.");
      setSubmitting(false);
      return;
    }

    alert("레시피가 업데이트되었습니다.");
    setSubmitting(false);
    router.replace(`/recipes/${recipe.id}`);
  };


  return (
    <main className={styles.viewport}>
      <div className={styles.page}>
        <header className={styles.header}>
          <button type="button" onClick={() => router.back()} className={styles.headerButton} aria-label="뒤로가기">
            <span className={styles.headerIconBack} aria-hidden="true"></span>
          </button>
          <h1 className={styles.headerTitle}>레시피 수정</h1>
        </header>

        <div className={styles.coverWrap}>
          {coverPreview && (
            <div className={styles.coverPreview}>
              <Image src={coverPreview} alt="커버 이미지 미리보기" fill className={styles.previewImage} />
            </div>
          )}

          <label htmlFor="cover-upload" className={styles.coverUpload}>
            <Image src="/images/addphoto.svg" alt="" width={26} height={26} aria-hidden="true" />
            <span>커버 사진 변경</span>
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
        </section>

        <div className={styles.bottomActionWrap}>
          <button type="button" className={styles.cancelButton} onClick={() => router.back()}>수정 취소</button>
          <button type="button" className={styles.bottomActionButton} onClick={handleSubmit}>
            레시피 수정 완료
          </button>
        </div>
      </div>
    </main>
  );
}
