"use client";

import Link from "next/link";
import { useState } from "react";
import styles from "./page.module.css";

const categories = [
  { icon: "soup_kitchen", label: "한식" },
  { icon: "rice_bowl", label: "중식" },
  { icon: "set_meal", label: "일식" },
  { icon: "local_pizza", label: "양식" },
  { icon: "kitchen", label: "메인요리" },
  { icon: "egg_alt", label: "밑반찬" },
  { icon: "ramen_dining", label: "국/찌개" },
  { icon: "cookie", label: "간식" },
];

const difficultyOptions = ["전체", "쉬움", "보통", "어려움"];
const timeOptions = ["15분 이내", "30분 이내", "60분 이내", "60분 이상"];
const ingredientOptions = ["고기", "채소", "해산물", "곡물"];

export default function SearchPage() {
  const [keyword, setKeyword] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>("한식");
  const [difficulty, setDifficulty] = useState("쉬움");
  const [time, setTime] = useState("30분 이내");
  const [ingredient, setIngredient] = useState("고기");

  return (
    <div className={`${styles.page} ui-mobile-page`}>
      <header className={`${styles.header} ui-page-header`}>
        <Link href="/" className={`${styles.iconButton} ui-reset-button`} aria-label="뒤로가기">
          <span className={`ui-material-icon ${styles.headerIcon}`} aria-hidden="true">
            arrow_back
          </span>
        </Link>
        <h1 className={styles.headerTitle}>레시피 검색</h1>
        <button type="button" className={`${styles.applyButton} ui-reset-button`}>
          적용
        </button>
      </header>

      <div className={styles.content}>
        <div className={styles.searchBox}>
          <span className={`ui-material-icon ${styles.searchIcon}`} aria-hidden="true">
            search
          </span>
          <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="요리 이름이나 식재료를 입력하세요"
            className={styles.searchInput}
          />
        </div>

        <section className={styles.blockSection}>
          <h2 className={styles.blockTitle}>카테고리</h2>

          <div className={styles.categoryList}>
            {categories.map((cat) => {
              const active = selectedCategory === cat.label;
              return (
                <button
                  key={cat.label}
                  type="button"
                  onClick={() => setSelectedCategory(cat.label)}
                  className={`${styles.categoryButton} ${active ? styles.categoryButtonActive : ""} ui-reset-button`}
                >
                  <span className={`ui-material-icon ${styles.categoryIcon}`} aria-hidden="true">
                    {cat.icon}
                  </span>
                  <span className={styles.categoryText}>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </section>

        <section className={styles.filterSection}>
          <h2 className={styles.blockTitle}>상세 필터</h2>

          <FilterGroup title="난이도" options={difficultyOptions} selected={difficulty} onSelect={setDifficulty} />

          <FilterGroup title="소요 시간" options={timeOptions} selected={time} onSelect={setTime} />

          <FilterGroup title="주요 식재료" options={ingredientOptions} selected={ingredient} onSelect={setIngredient} />
        </section>
      </div>

      <div className={styles.bottomActionWrap}>
        <button type="button" className={`${styles.bottomActionButton} ui-reset-button`}>
          <span className={`ui-material-icon ${styles.bottomActionIcon}`} aria-hidden="true">
            filter_list
          </span>
          필터 적용 검색
        </button>
      </div>
    </div>
  );
}

interface FilterGroupProps {
  title: string;
  options: string[];
  selected: string;
  onSelect: (value: string) => void;
}

function FilterGroup({ title, options, selected, onSelect }: FilterGroupProps) {
  return (
    <div className={styles.filterGroup}>
      <h3 className={styles.filterTitle}>{title}</h3>
      <div className={styles.filterOptionWrap}>
        {options.map((option) => {
          const active = selected === option;
          return (
            <button
              key={option}
              type="button"
              onClick={() => onSelect(option)}
              className={`${styles.filterOption} ${active ? styles.filterOptionActive : ""} ui-reset-button`}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}
