import PaddingContainer from "@/components/layout/PaddingContainer";
import Image from "next/image";
import React from "react";
import image from "@/assets/number1.png";
import directus from "@/lib/directus";
import { Magazine } from "@/types/collection";
import MagazineCard from "@/components/elements/MagazineCard";
import { getDictionary } from "@/lib/getDictionary";

const MagazinePage = async ({
  params,
}: {
  params: {
    lang: string;
  };
}) => {
  const locale = params.lang;
  const dictionary = await getDictionary(locale);
  const getAllMagazines = async () => {
    try {
      const magazines = await directus.items("magazine").readByQuery({
        filter: {
          status: {
            _eq: "published",
          },
        },
        fields: ["*", "translations.*"],
        sort: ["number"] as never[],
      });
      if (locale === "en") {
        return magazines?.data;
      } else {
        const localizedPost = magazines.data?.map((magazine: Magazine) => {
          return {
            ...magazine,
            title: magazine?.translations[0]?.title,
            desc: magazine?.translations[0]?.desc,
          };
        });

        return localizedPost;
      }
    } catch (error) {
      console.log(error);
      throw new Error("Error fetching posts");
    }
  };

  const magazines = await getAllMagazines();

  return (
    <div className="@container min-h-[50vh]">
      <PaddingContainer>
        {magazines ? (
          magazines.map((magazine: Magazine) => (
            <div key={magazine.id} className="  flex flex-col space-y-16">
              <MagazineCard
                magazine={magazine}
                collectMagazine={dictionary.magazinePage.collectMagazine}
                number={dictionary.magazinePage.number}
                inputName={dictionary.magazinePage.inputName}
                inputEmail={dictionary.magazinePage.inputEmail}
                submitButton={dictionary.magazinePage.submitButton}
                loadingText={dictionary.magazinePage.loading}
                locale={locale}
                messageText={dictionary.magazinePage.messageText}
              />
            </div>
          ))
        ) : (
          <h2 className=" text-center">No Magazine available</h2>
        )}
      </PaddingContainer>
    </div>
  );
};

export default MagazinePage;
