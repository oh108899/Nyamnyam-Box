"use client"

import Image from "next/image";
import { useBookmark } from "./BookmarkClient";
import styles from "./BookmarkButton.module.css";

interface Props {
  itemId: number | string;
  className?: string;
  imageClassName?: string;
  onToggle?: (isBookmarked: boolean) => void;
}

export default function BookmarkButton({ itemId, className, imageClassName, onToggle }: Props) {
  const { isBookmarked, handleToggleBookmark, loading } = useBookmark(itemId);

  // Link 막기
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    handleToggleBookmark().then(()=>{
      onToggle?.(!isBookmarked) //bookmark 해제 시 전달
    })
  }

  if (loading) 
    return null;

  return (
    <button
      onClick={handleClick}
      className={className}
      aria-label={isBookmarked ? "북마크 해제" : "북마크 추가"}
    >
      {
        isBookmarked
          ? <Image
            src="/images/bookmark-active-fill.svg"
            alt=""
            width={13}
            height={16}
            aria-hidden="true"
            className={styles.BookmarkIconActive}
          />
          : <Image
            src="/images/bookmark.svg"
            alt=""
            width={13}
            height={16}
            aria-hidden="true"
            className={imageClassName}
          />
      }
    </ button>
  )
}