'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { createClient } from '../../utils/supabase/client'
import { useRouter } from 'next/navigation'
import BookmarkButton from '../bookmark/BookmarkButton'

interface Props {
  recipeId: string
  recipeUserId: string
  className?: string
}

export default function RecipeHeaderActions({ recipeId, recipeUserId, className }: Props) {
  const supabase = createClient()
  const router = useRouter()
  const [myRecipe, setmyRecipe] = useState(false)

  useEffect(() => {

    const fetchMe = async () => {

      const { data: { user } } = await supabase.auth.getUser();
      setmyRecipe(user?.id === recipeUserId)
    }

    fetchMe()

  }, [recipeUserId])

  const handleRecipeDel = async(e) => {
    e.preventDefault();

    if (!confirm("레시피를 삭제할까요?")) return;

    await supabase.from("recipes").delete().eq("id", recipeId)
    router.push("/")
  }

  return myRecipe ? (
    <div className={className}>
      <Link href={`/recipes/${recipeId}/edit`}>수정</Link>
      <button onClick={handleRecipeDel}>삭제</button>
    </div>
  ) : (
    <BookmarkButton itemId={recipeId} />
  )
}