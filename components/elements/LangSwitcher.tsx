"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const LangSwitcher = ({ locale }: { locale: string }) => {
  const pathName = usePathname();

  const redirectTarget = (targetLanguage: string) => {
    if (!pathName) return " /";
    const segments = pathName.split("/");
    segments[1] = targetLanguage;
    return segments.join("/");
  };
  return (
    <div className="bg-base-100 border-accent border w-16 h-7 rounded-3xl flex items-center justify-around">
      <button
        className={` w-5 h-5 rounded-full text-sm font-bold flex justify-center items-center ${
          locale === "en" ? " p-2  text-red-500" : " "
        }`}
      >
        <Link
          className={locale === "en" ? "cursor-default" : ""}
          href={redirectTarget("en")}
          locale="en"
        >
          {" "}
          EN
        </Link>
      </button>
      <div className=" w-[1px] bg-accent h-7"></div>
      <button
        className={` w-5 h-5 rounded-full text-sm font-bold flex justify-center items-center ${
          locale === "bn" ? " p-2 text-red-500  " : " "
        }`}
      >
        <Link
          className={locale === "bn" ? "cursor-default" : ""}
          href={redirectTarget("bn")}
          locale="bn"
        >
          {" "}
          বাং
        </Link>
      </button>
    </div>
  );
};

export default LangSwitcher;
