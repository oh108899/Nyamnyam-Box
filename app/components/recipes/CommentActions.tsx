"use client";

interface CommentActionsProps {
  deleteClassName: string;
  editClassName: string;
  onDelete: () => void;
  onEdit: () => void;
  disabled?: boolean;
}

interface CommentWriteButtonProps {
  writeClassName: string;
  onWrite: () => void;
  disabled?: boolean;
}

export default function CommentActions({
  deleteClassName,
  editClassName,
  onDelete,
  onEdit,
  disabled,
}: CommentActionsProps) {
  return (
    <>

      <button
        className={deleteClassName}
        type="button" 
        onClick={onDelete}
        disabled={disabled}>
        삭제
      </button>

      <button
        className={editClassName}
        type="button" 
        onClick={onEdit}
        disabled={disabled}>
        수정
      </button>

    </>
  );
}

export function CommentWriteButton({ writeClassName, onWrite, disabled }: CommentWriteButtonProps) {
  return (
    <button
      className={writeClassName}
      type="button"
      onClick={onWrite}
      disabled={disabled}>
      댓글 작성
    </button>
  );
}
