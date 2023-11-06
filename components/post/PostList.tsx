import { Advertisement, Post, University } from "@/types/collection";
import PostCard from "./PostCard";
import StudentProjectSlider from "./StudentProjectSlider";
import StudentProjectCard from "../elements/StudentProjectCard";
import { getDictionary } from "@/lib/getDictionary";
import Link from "next/link";
import Image from "next/image";
import { shimmer, toBase64 } from "@/utils/shimmer";
import RecentNewsCard from "../elements/RecentNewsCard";

interface PostListProps {
  posts: Post[];
  layout?: "vertical" | "horizontal";
  locale: string;
  universities: University[];
  studentProjects: Post[];
  universityId: string;
  main_ad_photo: string;
  main_ad_link: string;
}

const PostList = async ({
  posts,
  layout = "vertical",
  locale,
  universities,
  studentProjects,
  universityId,
  main_ad_link,
  main_ad_photo,
}: PostListProps) => {
  const groupedPosts: { [categorySlug: string]: Post[] } = {};
  const categoryList = [
    "concepts",
    "arts",
    "heritage",
    "personality",
    "dialogue",
    "projects",
    "environment-and-planning",
  ]; // Specify the desired order

  const categorySlugToFilter = "student-projects";

  // Filter the studentProjects array by category.slug
  const filteredProjects = studentProjects.filter((project) => {
    return project.category.slug === categorySlugToFilter;
  });

  const dictionary = await getDictionary(locale);

  // Combine the filtered arrays into a single array
  const combinedFilteredProjects = [...filteredProjects];

  // Sorting the combinedFilteredProjects array by date_created in descending order
  const sortedPosts = combinedFilteredProjects.slice().sort((a, b) => {
    return (
      new Date(b.date_created).getTime() - new Date(a.date_created).getTime()
    );
  });

  const latestThreePosts = sortedPosts.slice(0, 3);

  const categoryNewsSlugToFilter = "news";

  const filteredNews = posts.filter((project) => {
    return project.category.slug === categoryNewsSlugToFilter;
  });
  const combinedFilteredNews = [...filteredNews];
  const sortedNews = combinedFilteredNews.slice().sort((a, b) => {
    return (
      new Date(b.date_created).getTime() - new Date(a.date_created).getTime()
    );
  });
  const latestThreeNewsPosts = sortedNews.slice(0, 3);

  // Group the posts by category
  posts.forEach((post) => {
    const categorySlug = post.category?.slug || "uncategorized";

    if (!groupedPosts[categorySlug]) {
      groupedPosts[categorySlug] = [];
    }
    groupedPosts[categorySlug].push(post);
  });

  // Create an array of Post objects in the order specified by categoryList
  const orderedPosts: Post[] = categoryList
    .map((categorySlug) => {
      // Return the latest post for the specified category if it exists
      return groupedPosts[categorySlug]?.[
        groupedPosts[categorySlug].length - 1
      ];
    })
    .filter((post) => post);

  const newsCategoryPosts = posts.filter(
    (post) => post.category.slug === "news",
  );

  const mainSliderUniversity = universities.find(
    (university) => university.id === universityId,
  );

  const studentPosts = mainSliderUniversity ? mainSliderUniversity.posts : [];

  // Get the latest post in the "news" category
  const latestNewsPost = newsCategoryPosts.reduce((latest, post) => {
    return post.date_created > latest.date_created ? post : latest;
  }, newsCategoryPosts[0]); // Use the first post as the initial value

  return (
    <div className="  grid grid-cols-1  md:grid-cols-2 gap-10">
      {orderedPosts.map((post, index) => (
        <PostCard
          key={post.id}
          className={`order-${index + 1}`}
          locale={locale}
          layout={layout}
          post={post}
        />
      ))}
      <StudentProjectSlider
      className=" order-10 md:order-none lg:border-l pl-10"  
        locale={locale}
        studentPosts={studentPosts}
      />
      <PostCard
        key={latestNewsPost.id}
        locale={locale}
        layout={layout}
        post={latestNewsPost}
        className={`order-8 md:order-9`}
      />
      {latestThreePosts ? (
        <div className=" lg:border-l order-11  md:order-10 lg:pl-10 flex flex-col justify-between ">
          <StudentProjectCard
            latestThreePosts={latestThreePosts}
            locale={locale}
          />
          <Link
            href={`/${locale}/student-projects`}
            className=" btn w-fit self-center lg:mb-14 mt-5 bg-accent text-secondary hover:text-accent"
          >
            {" "}
            {dictionary.mainBody.seeMore}{" "}
          </Link>
        </div>
      ) : (
        <h2>No Posts to Show</h2>
      )}
      {latestThreeNewsPosts ? (
        <div className="  lg:pr-10 order-9 md:order-11  flex flex-col justify-between ">
          <RecentNewsCard
            latestThreePosts={latestThreeNewsPosts}
            locale={locale}
          />
          <Link
            href={`/${locale}/news`}
            className=" btn w-fit self-center lg:mb-14 mt-5 bg-accent text-secondary hover:text-accent"
          >
            {" "}
            {dictionary.mainBody.seeMore}{" "}
          </Link>
        </div>
      ) : (
        <h2>No Posts to Show</h2>
      )}

      <div className="  md:border-l place-item-end lg:pl-10 order-last">
        {main_ad_photo && (
          <Link className="lg:ml-10 " href={main_ad_link || "/"}>
            <Image
              className=" aspect-square mx-auto  object-cover object-center"
              width={500}
              height={500}
              alt="Advertise Link"
              src={`${process.env.NEXT_PUBLIC_ASSETS_URL}${main_ad_photo}?key=optimized`}
              placeholder={`data:image/svg+xml;base64,${toBase64(
                shimmer(500, 500),
              )}`}
            />
          </Link>
        )}
      </div>
    </div>
  );
};

export default PostList;
