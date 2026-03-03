// 담당자 오세찬

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

type IngredientFieldError = {
  name?: string;
  qty?: string;
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
  const [aiGeneratedDraft, setAiGeneratedDraft] = useState(false);
  const [aiShareAgreed, setAiShareAgreed] = useState(false);
  const [aiGenerating, setAiGenerating] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [aiStepImageUrls, setAiStepImageUrls] = useState<Record<number, string>>({});
  const [aiTitleError, setAiTitleError] = useState("");
  const [titleError, setTitleError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [ingredientErrors, setIngredientErrors] = useState<Record<number, IngredientFieldError>>({});
  const [ingredientListError, setIngredientListError] = useState("");
  const [stepErrors, setStepErrors] = useState<Record<number, string>>({});
  const [stepListError, setStepListError] = useState("");

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
    setIngredientListError("");
    setIngredients((prev) => [...prev, { id: Date.now(), name: "", qty: "" }]);
  };

  const removeIngredient = (id: number) => {
    setIngredientErrors((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
    setIngredients((prev) => prev.filter((item) => item.id !== id));
  };

  const addStep = () => {
    setStepListError("");
    setSteps((prev) => [...prev, { id: Date.now(), description: "", imageFile: null, imagePreview: "" }]);
  };

  const removeStep = (id: number) => {
    setStepErrors((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
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

  const API_BASE = '/api/v1';
  const CLIENT_ID = process.env.NEXT_PUBLIC_AI_CLIENT_ID ?? "";
  async function apiRequest(path: string, options: RequestInit = {}) {
    const res = await fetch(`${API_BASE}${path}`, options);
    const data = await res.json();
    const only =
      typeof data?.content === "string"
        ? data.content
        : JSON.stringify(data, null, 2) ||
          typeof data?.summary === "string"
          ? data.summary
          : JSON.stringify(data, null, 2);
    return only;
  }
  const getAIRecipe = async () => {
    if (!CLIENT_ID) {
      console.error("NEXT_PUBLIC_AI_CLIENT_ID is not set");
      return;
    }

    const qs = new URLSearchParams({
      content: `응답은 무조건 JSON 형식으로 다른 어떤말도 하지마. 재료는 일반적으로 가정집에 있는 재료를 사용해. 제목: ${aiTitle}, 난이도: ${aiDifficulty}, 소요 시간: ${aiTime}, 재료 기준: ${aiServing}에 맞는 요리 레시피를 알려줘. 응답은 무조건 JSON 형식으로 만 해, 제목은 title, 난이도는 difficulty, 소요 시간은 time, 재료 기준은 serving, 레시피 설명은 desc, 재료는 ingredients 배열로 (재료명 name, 양 qty), 요리 순서는 steps 배열로 (순서 step_num, 내용 content) 표현해줘. 제목이 특정 요리명이 아니라 재료명일 경우, 해당 재료로 만들 수 있는 대표적인 요리를 생성해. 그 다음 제목엔 그 요리의 제목을 써.`
      ,
      client_id: CLIENT_ID
    }).toString();
    const data = await apiRequest(`/question?${qs}`);
    const cleaned = data
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();
    let aiRecipe;
    try {
      aiRecipe = JSON.parse(cleaned);
    } catch (err) {
      console.error("AI 응답 파싱 실패", err);
      return;
    }
    return aiRecipe;
  };

  const handleSubmit = async () => {
    if (aiGenerating || submitting) return;

    if (activeTab === "ai" && !aiGeneratedDraft) {
      if (!aiTitle.trim()) {
        setAiTitleError("레시피 제목을 입력해주세요.");
        return;
      }
      setAiTitleError("");

      setAiGenerating(true);
      const aiRecipe = await getAIRecipe();
      setAiGenerating(false);

      if (!aiRecipe) {
        alert("AI 레시피 생성에 실패했습니다. 다시 시도해주세요.");
        return;
      }

      setTitle(String(aiRecipe.title ?? ""));
      setDescription(String(aiRecipe.desc ?? ""));

      setDifficulty(aiRecipe.difficulty as Difficulty);
      setTime(aiRecipe.time as Time);
      setServing(aiRecipe.serving as Serving);

      const generatedIngredients = Array.isArray(aiRecipe.ingredients)
        ? aiRecipe.ingredients.map((item: any, index: number) => ({
          id: Date.now() + index,
          name: String(item?.name ?? ""),
          qty: String(item?.qty ?? ""),
        }))
        : [];
      setIngredients(generatedIngredients.length > 0 ? generatedIngredients : [{ id: Date.now(), name: "", qty: "" }]);

      const generatedSteps = Array.isArray(aiRecipe.steps)
        ? aiRecipe.steps.map((item: any, index: number) => ({
          id: Date.now() + index + 1000,
          description: String(item?.content ?? ""),
          imageFile: null,
          imagePreview: "",
        }))
        : [];
      const nextSteps: Step[] = generatedSteps.length > 0 ? generatedSteps : [{ id: Date.now(), description: "", imageFile: null, imagePreview: "" }];
      setSteps(nextSteps);

      const imgUrlMap: Record<number, string> = {};
      nextSteps.forEach((step: Step, index: number) => {
        const url = Array.isArray(aiRecipe.steps) ? String(aiRecipe.steps[index]?.img_url ?? "") : "";
        imgUrlMap[step.id] = url;
      });
      setAiStepImageUrls(imgUrlMap);
      setAiGeneratedDraft(true);
      setAiShareAgreed(false);
      return;
    }

    if (aiGeneratedDraft && !aiShareAgreed) {
      alert("AI 생성 레시피 저장을 위해 공유 동의 체크가 필요합니다.");
      return;
    }

    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();
    let hasValidationError = false;

    setTitleError("");
    setDescriptionError("");
    setIngredientListError("");
    setStepListError("");
    setIngredientErrors({});
    setStepErrors({});

    if (!trimmedTitle) {
      setTitleError("레시피 제목을 입력해주세요.");
      hasValidationError = true;
    }

    if (!trimmedDescription) {
      setDescriptionError("레시피 설명을 입력해주세요.");
      hasValidationError = true;
    }

    if (ingredients.length === 0) {
      setIngredientListError("재료를 최소 1개 이상 입력해주세요.");
      hasValidationError = true;
    } else {
      const nextIngredientErrors: Record<number, IngredientFieldError> = {};
      ingredients.forEach((item) => {
        const nextError: IngredientFieldError = {};
        if (!item.name.trim()) nextError.name = "재료명을 입력해주세요.";
        if (!item.qty.trim()) nextError.qty = "양을 입력해주세요.";
        if (nextError.name || nextError.qty) {
          nextIngredientErrors[item.id] = nextError;
          hasValidationError = true;
        }
      });
      setIngredientErrors(nextIngredientErrors);
    }

    if (steps.length === 0) {
      setStepListError("요리 순서를 최소 1개 이상 입력해주세요.");
      hasValidationError = true;
    } else {
      const nextStepErrors: Record<number, string> = {};
      steps.forEach((step) => {
        if (!step.description.trim()) {
          nextStepErrors[step.id] = "요리 순서를 입력해주세요.";
          hasValidationError = true;
        }
      });
      setStepErrors(nextStepErrors);
    }

    if (hasValidationError) {
      return;
    }

    const ingredientRows = ingredients.map((item) => ({
      name: item.name.trim(),
      qty: item.qty.trim(),
    }));

    const normalizedSteps = steps.map((step) => ({
      ...step,
      description: step.description.trim(),
    }));

    setSubmitting(true);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error(userError);
      router.push("/login");
      setSubmitting(false);
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
        setSubmitting(false);
        return;
      }

      const { data: coverUrlData } = supabase.storage.from("thumb").getPublicUrl(coverPath);
      thumbUrl = coverUrlData.publicUrl;
    }

    const recipePayload = {
      title: trimmedTitle,
      desc: trimmedDescription,
      thumb: thumbUrl,
      difficulty: difficulty,
      cooking_time: time,
      serving: serving,
      is_AI: aiGeneratedDraft,
      user_id: user.id,
    };

    const { data: savedRecipe, error: recipeError } = await supabase
      .from("recipes")
      .insert(recipePayload)
      .select("id")
      .single();

    if (recipeError || !savedRecipe) {
      console.error(recipeError);
      setSubmitting(false);
      return;
    }

    const ingredientInsertRows = ingredientRows.map((item) => ({
      recipe_id: savedRecipe.id,
      name: item.name,
      qty: item.qty,
    }));

    if (ingredientInsertRows.length > 0) {
      const { error: ingredientError } = await supabase.from("ingredients").insert(ingredientInsertRows);

      if (ingredientError) {
        console.error(ingredientError);
        setSubmitting(false);
        return;
      }
    }

    const stepRows: Array<{ recipe_id: number; step_num: number; content: string; img_url: string }> = [];

    for (let index = 0; index < normalizedSteps.length; index += 1) {
      const step = normalizedSteps[index];
      let stepImageUrl = "";

      if (step.imageFile) {
        const ext = step.imageFile.name.split(".").pop() || "jpg";
        const stepPath = `${user.id}/${savedRecipe.id}/step-${index + 1}-${Date.now()}.${ext}`;
        const { error: stepUploadError } = await supabase.storage.from("steps").upload(stepPath, step.imageFile, {
          upsert: true,
        });

        if (stepUploadError) {
          console.error(stepUploadError);
          setSubmitting(false);
          return;
        }

        const { data: stepUrlData } = supabase.storage.from("steps").getPublicUrl(stepPath);
        stepImageUrl = stepUrlData.publicUrl;
      } else if (aiGeneratedDraft) {
        stepImageUrl = aiStepImageUrls[step.id] ?? "";
      }

      stepRows.push({
        recipe_id: savedRecipe.id,
        step_num: index + 1,
        content: step.description,
        img_url: stepImageUrl,
      });
    }

    if (stepRows.length > 0) {
      const { error: stepError } = await supabase.from("recipe-steps").insert(stepRows);

      if (stepError) {
        console.error(stepError);
        setSubmitting(false);
        return;
      }
    }

    setSubmitting(false);
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
            <Image src="/images/back.svg" alt="" width={20} height={19} />
          </button>
          <h1 className={styles.headerTitle}>레시피 작성</h1>
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
          {activeTab === "manual" || (activeTab === "ai" && aiGeneratedDraft) ? (
            <>
              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>기본 정보</h2>
                <label className={styles.fieldLabel}>레시피 제목</label>
                <input
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (e.target.value.trim()) setTitleError("");
                  }}
                  placeholder="레시피 제목을 설명해 주세요"
                  className={styles.input}
                />
                {titleError && <p className={styles.fieldError}>{titleError}</p>}
                <label className={styles.fieldLabel}>레시피 설명</label>
                <textarea
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                    if (e.target.value.trim()) setDescriptionError("");
                  }}
                  placeholder="레시피 설명을 입력 해 주세요"
                  className={styles.textarea}
                />
                {descriptionError && <p className={styles.fieldError}>{descriptionError}</p>}
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
                      <div className={styles.fieldWrap}>
                        <input
                          placeholder="요리 재료 입력"
                          className={styles.input}
                          value={item.name}
                          onChange={(e) => {
                            setIngredients((prev) =>
                              prev.map((ingredient) => (ingredient.id === item.id ? { ...ingredient, name: e.target.value } : ingredient)),
                            );
                            if (e.target.value.trim()) {
                              setIngredientErrors((prev) => ({
                                ...prev,
                                [item.id]: { ...prev[item.id], name: "" },
                              }));
                            }
                          }}
                        />
                        {ingredientErrors[item.id]?.name && <p className={styles.fieldError}>{ingredientErrors[item.id]?.name}</p>}
                      </div>
                      <div className={styles.fieldWrap}>
                        <input
                          placeholder="1큰술"
                          className={styles.amountInput}
                          value={item.qty}
                          onChange={(e) => {
                            setIngredients((prev) =>
                              prev.map((ingredient) => (ingredient.id === item.id ? { ...ingredient, qty: e.target.value } : ingredient)),
                            );
                            if (e.target.value.trim()) {
                              setIngredientErrors((prev) => ({
                                ...prev,
                                [item.id]: { ...prev[item.id], qty: "" },
                              }));
                            }
                          }}
                        />
                        {ingredientErrors[item.id]?.qty && <p className={styles.fieldError}>{ingredientErrors[item.id]?.qty}</p>}
                      </div>
                      <button type="button" onClick={() => removeIngredient(item.id)} className={styles.removeButton}>
                        <span className={styles.materialIcon} aria-hidden="true">
                          remove_circle_outline
                        </span>
                      </button>
                    </div>
                  ))}
                </div>
                {ingredientListError && <p className={styles.fieldError}>{ingredientListError}</p>}
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
                        <div className={styles.fieldWrap}>
                          <textarea
                            value={step.description}
                            onChange={(e) => {
                              setSteps((prev) => prev.map((item) => (item.id === step.id ? { ...item, description: e.target.value } : item)));
                              if (e.target.value.trim()) {
                                setStepErrors((prev) => ({ ...prev, [step.id]: "" }));
                              }
                            }}
                            placeholder="요리 순서 입력"
                            className={styles.stepTextarea}
                          />
                          {stepErrors[step.id] && <p className={styles.fieldError}>{stepErrors[step.id]}</p>}
                        </div>
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
                {stepListError && <p className={styles.fieldError}>{stepListError}</p>}
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
                  onChange={(e) => {
                    setAiTitle(e.target.value);
                    if (e.target.value.trim()) setAiTitleError("");
                  }}
                  placeholder="레시피 제목을 설명해 주세요"
                  className={styles.input}
                />
                {aiTitleError && <p className={styles.fieldError}>{aiTitleError}</p>}
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

          {aiGeneratedDraft && (
            <section className={styles.section}>
              <label className={styles.shareAgreeLabel}>
                <input
                  type="checkbox"
                  checked={aiShareAgreed}
                  onChange={(e) => setAiShareAgreed(e.target.checked)}
                />
                <span>AI생성 레시피 저장시 다른사람에게 공유될 수 있습니다.</span>
              </label>
            </section>
          )}
        </section>

        <div className={styles.bottomActionWrap}>
          <button type="button" className={styles.cancelButton} onClick={() => router.back()}>작성 취소</button>
          <button
            type="button"
            className={styles.bottomActionButton}
            onClick={() => handleSubmit()}
            disabled={aiGenerating || submitting || (aiGeneratedDraft && !aiShareAgreed)}
          >
            {activeTab === "ai" && !aiGeneratedDraft
              ? (aiGenerating ? "AI 레시피 생성중..." : "AI 레시피 생성")
              : aiGeneratedDraft
                ? "AI 레시피 저장"
                : "레시피 작성 완료"}
          </button>
        </div>
      </div>
    </main>
  );
}
