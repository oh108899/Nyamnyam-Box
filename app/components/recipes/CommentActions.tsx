"use client";

interface CommentActionsProps {
  deleteClassName: string;
  editClassName: string;
}

interface CommentWriteButtonProps {
  writeClassName: string;
}

export default function CommentActions({ deleteClassName, editClassName }: CommentActionsProps) {
  const handleDelete = () => {
    console.log("댓글 삭제 클릭");
  };

  const handleEdit = () => {
    console.log("댓글 수정 클릭");
  };

  return (
    <>
      <button className={deleteClassName} onClick={handleDelete}>
        삭제
      </button>
      <button className={editClassName} onClick={handleEdit}>
        수정
      </button>
    </>
  );
}

export function CommentWriteButton({ writeClassName }: CommentWriteButtonProps) {
  const handleWrite = () => {
    console.log("댓글 작성 클릭");
  };

  return (
    <button className={writeClassName} type="button" onClick={handleWrite}>
      댓글 작성
    </button>
  );
}
