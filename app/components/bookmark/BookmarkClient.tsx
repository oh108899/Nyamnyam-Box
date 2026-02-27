"use client"

import { useState, useEffect } from "react";
import { createClient } from "../../utils/supabase/client";


export function useBookmark(itemId: string) {
  const [loading, setLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);
  
  useEffect(() => {
    const supabase = createClient();

    const check = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("bookmark")
        .select("id")
        .eq("user_id", user.id)
        .eq("recipe_id", itemId);

      setIsBookmarked(data && data.length > 0);
      setLoading(false);
    };
    check();
  }, [itemId]);

  const handleToggleBookmark = async () => {
    
    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      alert("북마크 기능은 로그인 후 이용 가능합니다.")
      return;
    }

    if (isBookmarked) {
      await supabase.from("bookmark").delete()
        .eq("user_id", user.id)
        .eq("recipe_id", itemId);
    } else {
      await supabase.from("bookmark").insert({ user_id: user.id, recipe_id: itemId });
    }
    setIsBookmarked(prev => !prev);
  };

  return { isBookmarked, handleToggleBookmark, loading };
}