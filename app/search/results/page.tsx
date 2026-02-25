"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./page.module.css";
import { createClient } from "../../utils/supabase/client";
import BottomNav from "../components/BottomNav";
import LogoHeader from "../components/LogoHeader";

type RecipeRow = {
  id: string;
  title: string;
  thumb: string | null;
  time: string | number | null;
  cooking_time: string | number | null;
  description?: string | null;
};

export default function SearchResultsPage() {
  const router = useRouter();
  const sp = useSearchParams();

  const supabase = useMemo(() => createClient(), []);
  const qParam = sp.get("q") ?? "";

  const [keyword, setKeyword] = useState(qParam);
  const [results, setResults] = useState<RecipeRow[]>([]);
  const [loadingResults, setLoadingResults] = useState(false);

  useEffect(() => {
    setKeyword(qParam);
  }, [qParam]);

  async function fetchResults(q: string) {
    setLoadingResults(true);
    try {
      const trimmed = q.trim();

      let query = supabase
        .from("recipes")
        .select("id,title,image,time,cooking_time,description")
        .limit(50);

      if (trimmed) {
        query = query.or(`title.ilike.%${trimmed}%,description.ilike.%${trimmed}%`);
      }

      const { data, error } = await query;

      if (error) {
        console.error(error);
        setResults([]);
        return;
      }

      setResults((data ?? []) as RecipeRow[]);
    } catch (e) {
      console.error(e);
      setResults([]);
    } finally {
      setLoadingResults(false);
    }
  }

  useEffect(() => {
    fetchResults(qParam);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qParam]);

  function handleSearch() {
    const next = new URLSearchParams(sp.toString());
    const q = keyword.trim();
    if (q) next.set("q", q);
    else next.delete("q");
    router.push(`/search/results?${next.toString()}`);
  }

  return (
    <main className={styles.viewport}>
      <div className={styles.page}>
        <LogoHeader
          headerClassName={styles.header}
          logoHeadingClassName={styles.logoHeading}
          logoLinkClassName={styles.logoLink}
          headerButtonClassName={styles.headerButton}
        />

        <section className={styles.content}>
          <h2 className={styles.sectionTitle}>검색 결과</h2>

          <div className={styles.searchRow}>
            <input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch();
              }}
              className={styles.searchInput}
              placeholder="레시피 검색"
            />
          </div>

          <p className={styles.countText}>{loadingResults ? "검색중..." : `${results.length}개`}</p>

          <div className={styles.resultsList}>
            {loadingResults
              ? Array.from({ length: 4 }, (_, index) => (
                <article key={`result-skel-${index}`} className={styles.resultCard}>
                  <div className={styles.resultImageSkeleton} aria-hidden="true" />
                  <div className={styles.resultTitleSkeleton} aria-hidden="true" />
                  <div className={styles.resultMetaSkeleton} aria-hidden="true" />
                </article>
              ))
              : results.map((r) => (
                <Link key={r.id} href={`/recipes/${r.id}`} className={styles.resultCard}>
                  <div className={styles.resultImageWrap}>
                    {r.image ? (
                      <Image
                        src={r.image}
                        alt={r.title}
                        fill
                        sizes="(max-width: 600px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className={styles.resultImage}
                      />
                    ) : (
                      <div className={styles.resultImagePlaceholder} />
                    )}
                  </div>
                  <h3 className={styles.resultTitle}>{r.title}</h3>
                  <div className={styles.resultMeta}>{r.time ?? r.cooking_time ?? "-"}</div>
                </Link>
              ))}
          </div>
        </section>

        <BottomNav activeTab="search" />
      </div>
    </main>
  );
}