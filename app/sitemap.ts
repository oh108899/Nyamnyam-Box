import { createClient } from "@/app/utils/supabase/client";

export default async function sitemap(){
  const Url = "https://nyamnyam-box.vercel.app";
  const supabase = createClient();

  const { data: recipes } = await supabase
    .from("recipes")
    .select("id, updated_at, created_at");

  const recipeUrls =
    recipes?.map((recipe) => ({
      url: `${Url}/recipes/${recipe.id}`,
      lastModified: recipe.updated_at
        ? new Date(recipe.updated_at)
        : new Date(recipe.created_at)
    })) ?? [];

  return [
    {
      url: `${Url}/`,
      lastModified: new Date(),
    },
    {
      url: `${Url}/recipes`,
      lastModified: new Date(),
    },
    {
      url: `${Url}/search`,
      lastModified: new Date(),
    },
    {
      url: `${Url}/search/result`,
      lastModified: new Date(),
    },
    ...recipeUrls,
  ];
}