"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { createClient } from "../../utils/supabase/client";
import CommentActions, { CommentWriteButton } from "./CommentActions";

type ReviewRow = {
  id: number;
  user_id: string;
  recipe_id: number;
  nick_name: string;
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
  commentsContent: string;
  commentsEditButton: string;
  commentsEditButtonConfirm: string;
  commentsEditButtonCancle: string;
};

type Me = {
  id: string;
  nick_name: string;
};

const supabase = createClient(); 

export default function CommentsClient({
  recipeId,
  classNames,
}: {
  recipeId: number;
  classNames: ClassNames;
}) {
  const [me, setMe] = useState<Me | null>(null);
  const [reviews, setReviews] = useState<ReviewRow[]>([]);
  const [newComment, setNewComment] = useState("");

  // 인라인 수정 상태
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editComment, setEditComment] = useState("");


  useEffect(() => {

    //프로필 가져오기
    const fetchMe = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) return;

      const { data: profile, error: profileError } = await supabase
        .from("profile")
        .select()
        .eq("id", user.id)
        .single();

      if (profileError) {
        console.error("프로필을 로딩할 수 없습니다:", profileError);
        return;
      }

      setMe(profile);
    };

    fetchMe();
  }, [recipeId]);

  // 댓글 가져오기
  useEffect(() => {
    if (!recipeId) return;

    const fetchReviews = async () => {
      const { data, error } = await supabase
        .from("review")
        .select("*")
        .eq("recipe_id", recipeId)
        .order("created_at", { ascending: true });

      if (error) {
        console.error("댓글 로딩 에러:", error);
        return;
      }
      setReviews((data ?? []) as ReviewRow[]);
    };

    fetchReviews();
  }, [recipeId]);


  // 수정 시작
  const startEdit = (r: ReviewRow) => {
    setEditingId(r.id);
    setEditComment(r.comment);
  };

  // 수정 취소
  const cancelEdit = () => {
    setEditingId(null);
    setEditComment("");
  };

  // 수정 완료(저장)
  const handleUpdate = async () => {
    if (!me || editingId === null) return;

    const comment = editComment.trim();
    if (!comment) return;

    const { data, error } = await supabase
      .from("review")
      .update({ comment, updated_at: new Date().toISOString() })
      .eq("id", editingId)
      .select("*")
      .single();

    if (error) {
      console.error(error);
      return;
    }

    setReviews((prev) => prev.map((r) => (r.id === editingId ? (data as ReviewRow) : r)));
    cancelEdit();
  };

  // 댓글 작성
  const handleWrite = async () => {
    if (!me) {
      alert("댓글 작성은 로그인이 필요합니다.");
      return;
    }

    const comment = newComment.trim();
    if (!comment) return;

    const { data, error } = await supabase
      .from("review")
      .insert({ recipe_id: recipeId, user_id: me.id, comment, nick_name: me.nick_name })
      .select("*")
      .single();

    if (error) {
      console.error(error);
      return;
    }

    setReviews((prev) => [...prev, data as ReviewRow]);
    setNewComment("");
  };

  // 댓글 삭제
  const handleDelete = async (reviewId: number) => {
    if (!confirm("댓글을 삭제할까요?")) return;

    const { error } = await supabase.from("review").delete().eq("id", reviewId);
    if (error) {
      console.error(error);
      return;
    }

    setReviews((prev) => prev.filter((r) => r.id !== reviewId));
    if (editingId === reviewId) cancelEdit();
  };

  return (
    <>
      <div>
        <textarea
          className={`${classNames.commentsContext} ${classNames.commentsPreContext} ${classNames.commentsWrap}`}
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder={me ? "댓글을 작성해주세요" : "로그인 후 댓글 작성 가능합니다"}
          disabled={!me}
        />
        <CommentWriteButton
          writeClassName={classNames.commentsWrite}
          onWrite={handleWrite}
          disabled={!me}
        />
      </div>

      {reviews.map((r) => {
        const isMine = me?.id === r.user_id;
        const isEditing = editingId === r.id;

        return (
          <div key={r.id} className={classNames.commentsWrap}>
            <div className={classNames.commentsProfile}>
              <Image src="/images/profilePrm.svg" alt="" width={40} height={40} />
            </div>

            <div className={classNames.commentsBox}>
              <div className={classNames.commentsUser}>
                <span className={classNames.commentsId}>{r.nick_name}</span>

                {isMine && !isEditing && (
                  <div className={classNames.commentsMy}>
                    <CommentActions
                      deleteClassName={classNames.commentsDel}
                      editClassName={classNames.commentsEdit}
                      onDelete={() => handleDelete(r.id)}
                      onEdit={() => startEdit(r)}
                    />
                  </div>
                )}
              </div>

              {isEditing ? (
                <>
                  <textarea
                    className={classNames.commentsContext}
                    value={editComment}
                    onChange={(e) => setEditComment(e.target.value)}
                    autoFocus
                  />
                  <div className={classNames.commentsEditButton}>
                    <button
                      type="button"
                      onClick={handleUpdate}
                      disabled={!editComment.trim()}
                      className={classNames.commentsEditButtonConfirm}
                    >
                      수정완료
                    </button>
                    <button
                      type="button"
                      onClick={cancelEdit}
                      className={classNames.commentsEditButtonCancle}
                    >
                      취소
                    </button>
                  </div>
                </>
              ) : (
                <p className={classNames.commentsContent}>{r.comment}</p>
              )}
            </div>
          </div>
        );
      })}
    </>
  );
}
