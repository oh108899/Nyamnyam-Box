"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { createClient } from "../../utils/supabase/client";
import CommentActions, { CommentWriteButton } from "./CommentActions";

type ReviewRow = {
  id: number;
  user_id: string;
  nick_name: string;
  recipe_id: number;
  comment: string;
  created_at: string;
  updated_at: string | null;
};

type ClassNames = {
  commentsWrap: string;
  commentsProfile: string;
  commentsBox: string;
  commentsUser: string;
  commentsId: string;
  commentsMy: string;
  commentsDel: string;
  commentsEdit: string;
  commentsContext: string;
  commentsWrite: string;
  commentsPreContext: string;
};

export default function CommentsClient({
  recipeId,
  classNames,
}: {
  recipeId: number;
  classNames: ClassNames;
}) {
  const supabase = useMemo(() => createClient(), []);

  const [user, setUser] = useState<{ id: string } | null>(null);
  const [reviews, setReviews] = useState<ReviewRow[]>([]);
  const [newComment, setNewComment] = useState("");

  //댓글 수정
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editComment, setEditComment] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user ? { id: data.user.id } : null);
    });
  }, [supabase]);

  useEffect(() => {
    if (!recipeId) return;

    (async () => {
      const { data, error } = await supabase
        .from("review")
        .select("*")
        .eq("recipe_id", recipeId)
        .order("created_at", { ascending: true });

      if (error) console.error(error);
      else setReviews((data ?? []) as ReviewRow[]);
    })();
  }, [recipeId, supabase]);

  const handleWrite = async () => {
    if (!user) {
      alert("댓글 작성은 로그인이 필요합니다.");
      return;
    }

    const comment = newComment.trim();
    if (!comment) return;

    const { data, error } = await supabase
      .from("review")
      .insert({ recipe_id: recipeId, nick_name: user.nick_name, user_id: user.id, comment })
      .select("*")
      .single();

    if (error) {
      console.error(error);
      return;
    }

    setReviews((prev) => [...prev, data as ReviewRow]);
    setNewComment("");
  };



  const handleDelete = async (reviewId: number) => {
    if (!confirm("댓글을 삭제할까요?")) return;

    const { error } = await supabase.from("review").delete().eq("id", reviewId);
    if (error) {
      console.error(error);
      return;
    }

    setReviews((prev) => prev.filter((r) => r.id !== reviewId));
  };

  return (
    <>
      <div>
        <textarea
          className={`${classNames.commentsContext} ${classNames.commentsPreContext} ${classNames.commentsWrap}`}
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder={user ? "댓글을 입력하세요" : "로그인 후 댓글 작성 가능"}
          disabled={!user}
        />
        <CommentWriteButton
          writeClassName={classNames.commentsWrite}
          onWrite={handleWrite}
          disabled={!user}
        />
      </div>

      {reviews.map((r) => (
        <div key={r.id} className={classNames.commentsWrap}>
          <div className={classNames.commentsProfile}>
            <Image src="/images/profilePrm.svg" alt="" width={40} height={40} />
          </div>

          <div className={classNames.commentsBox}>
            <div className={classNames.commentsUser}>
              <span className={classNames.commentsId}>{r.user_id}</span>

              {user?.id === r.user_id && (
                <div className={classNames.commentsMy}>
                  <CommentActions
                    deleteClassName={classNames.commentsDel}
                    editClassName={classNames.commentsEdit}
                    onDelete={() => handleDelete(r.id)}
                    onEdit={() => handleEdit(r.id)}
                  />
                </div>
              )}
            </div>

            <p className={classNames.commentsContext}>{r.comment}</p>
          </div>
        </div>
      ))}
    </>
  );
}
