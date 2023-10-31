import { getDictionary } from "@/lib/getDictionary";
import { Post } from "@/types/collection";
import React from "react";
import Slider from "../elements/Slider";

const StudentProjectSlider = async ({
  locale,
  className,
  studentPosts,
}: {
  locale: string;
  className: string;
  studentPosts: Post[];
}) => {
  const dictionary = await getDictionary(locale);
  return (
    <div className={`${className} flex flex-col gap-5`}>
      <h2 className=" text-2xl italic md:text-3xl lg:text-4xl underline    decoration-red-700">
        {dictionary.navigation.links.studentProjects}
      </h2>
      <p>
        {studentPosts[0]?.university.name}{" "}
        {dictionary.studentProjects.sliderTitle}
      </p>
      <div className=" z-[-50]">
        <Slider studentPosts={studentPosts} locale={locale} />
      </div>
    </div>
  );
};

export default StudentProjectSlider;
