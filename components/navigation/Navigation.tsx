import React from "react";
import { getDictionary } from "@/lib/getDictionary";
import HeaderLogo from "./HeaderLogo";
import directus from "@/lib/directus";
import { Post } from "@/types/collection";
import StickyHeader from "./StickeyHeader";

const Navigation = async ({ locale }: { locale: string }) => {
  const getAllPosts = async () => {
    try {
      const posts = await directus.items("post").readByQuery({
        filter: {
          status: {
            _eq: "published",
          },
        },
        fields: [
          "id",
          "slug",
          "title",
          "image",
          "left_ad",
          "right_ad",
          "category.slug",
          "category.id",
          "category.title",
          "category.translations.*",
          "translations.*",
        ],
      });
      if (locale === "en") {
        return posts.data;
      } else {
        const localizedPost = posts.data?.map((post: Post) => {
          return {
            ...post,
            title: post.translations[0].title,
            category: {
              ...post.category,
              title: post.category.translations[0].title,
            },
          };
        });

        return localizedPost;
      }
    } catch (error) {
      console.log(error);
      // throw new Error("Error fetching posts");
    }
  };

  const posts = await getAllPosts();

  const dictionary = await getDictionary(locale);

  return (
    <>
      <HeaderLogo locale={locale} />

      <StickyHeader
        locale={locale}
        dictionary={dictionary}
        posts={posts || []}
      />
    </>
  );
};

export default Navigation;
