"use client";
import directus from "@/lib/directus";
import { Magazine } from "@/types/collection";
import { shimmer, toBase64 } from "@/utils/shimmer";
import Image from "next/image";
import React, { FormEvent, useEffect, useState } from "react";
import parse from "html-react-parser";
const MagazineCard = ({
  magazine,
  collectMagazine,
  number,
  inputName,
  inputEmail,
  submitButton,
  locale,
  loadingText,
  messageText,
}: {
  magazine: Magazine;
  collectMagazine: string;
  number: string;
  inputName: string;
  inputEmail: string;
  submitButton: string;
  locale: string;
  loadingText: string;
  messageText: string;
}) => {
  const getLocalizedPageNumber = (pageNumber: number, locale: string) => {
    const convertToBengali = (num: number) => {
      const numbersInBengali = [
        "০",
        "১",
        "২",
        "৩",
        "৪",
        "৫",
        "৬",
        "৭",
        "৮",
        "৯",
      ];
      const digits = num.toString().split("");
      const bengaliDigits = digits.map(
        (digit) => numbersInBengali[Number(digit)],
      );
      return bengaliDigits.join("");
    };

    if (locale === "bn") {
      return convertToBengali(pageNumber);
    } else {
      return pageNumber.toString();
    }
  };

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const submitHandler = async (e: FormEvent) => {
    try {
      e.preventDefault();
      setIsLoading(true);
      await directus.items("request_magazine").createOne({
        name,
        email,
        description,
        requested_magazine: magazine.id,
        status: "pending",
      });
      setIsLoading(false);
      setShowSuccessMessage(true);
      setName("");
      setDescription("");
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 10000);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const getParsedHtml = (body: string) => {
    return parse(body);
  };

  useEffect(() => {
    // Clear the success message after 3 seconds
    if (showSuccessMessage) {
      const timeoutId = setTimeout(() => {
        setShowSuccessMessage(false);
      }, 10000);

      // Clear the timeout when the component unmounts
      return () => clearTimeout(timeoutId);
    }
  }, [showSuccessMessage]);

  return (
    <div className="@container flex md:flex-row my-5 mb-10 flex-col  gap-10 items-center">
      <Image
        width={365}
        height={480}
        className="flex-1  max-w-[325px] aspect-[13/19]  "
        src={`${process.env.NEXT_PUBLIC_ASSETS_URL}${magazine.image}?key=optimized`}
        alt="image"
        placeholder={`data:image/svg+xml;base64,${toBase64(shimmer(365, 480))}`}
      />
      {locale == "bn" ? (
        <div className="flex-1 flex flex-col gap-2">
          <h2 className=" text-5xl font-semibold">
            {number} {getLocalizedPageNumber(magazine.number, locale)}
          </h2>
          <h2 className=" text-3xl">{magazine.title}</h2>
          <div>{getParsedHtml(magazine.desc || "")}</div>
          <p className=" text-xl">{collectMagazine}</p>
          <form className=" flex flex-col gap-5" onSubmit={submitHandler}>
            <input
              required
              type="text"
              placeholder={inputName}
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
              className="input input-bordered w-full max-w-xs"
            />
            <input
              required
              type="email"
              placeholder={inputEmail}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              className="input input-bordered w-full max-w-xs"
            />
            <input
              className=" btn font-normal bg-red-700 text-white w-fit"
              type="submit"
              value={isLoading ? loadingText : submitButton}
            />
            {showSuccessMessage && (
              <div className="alert alert-success">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="stroke-current shrink-0 h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>{messageText}</span>
              </div>
            )}
          </form>
        </div>
      ) : (
        <div>
          <div>{getParsedHtml(magazine.desc || "")}</div>
        </div>
      )}
    </div>
  );
};

export default MagazineCard;
