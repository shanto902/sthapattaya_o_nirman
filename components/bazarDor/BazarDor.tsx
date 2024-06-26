"use client";
import React from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
import parse from "html-react-parser";
// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { BazaarDor } from "@/types/collection";
import { Navigation, Pagination } from "swiper/modules";
import Image from "next/image";
import { shimmer, toBase64 } from "@/utils/shimmer";
import "./styles.css";
import PostBody from "../post/PostBody";
const BazarDor = ({
  bazarDor,
  locale,
}: {
  bazarDor: BazaarDor[];
  locale: string;
}) => {
  const getParsedHtml = (body: string) => {
    return parse(body);
  };
  return (
    <div className="h-screen">
      <Swiper
        pagination={{
          type: "bullets",
        }}
        navigation={true}
        modules={[Pagination, Navigation]}
        className="mySwiper !z-[0]"
      >
        {bazarDor.map((bazar) => (
          <SwiperSlide key={bazar.id}>
            <div className=" px-10">
              <h3 className="text-center text-2xl font-semibold mb-5">
                {bazar.title}
              </h3>

              <div className=" flex flex-col md:flex-row md:gap-10 justify-between items-center gap-5 ">
                {" "}
                <Image
                  className=" aspect-square mx-auto  object-cover object-center flex-1 p-10"
                  width={500}
                  height={500}
                  alt="Advertise Link"
                  src={`${process.env.NEXT_PUBLIC_ASSETS_URL}${bazar.image}?key=optimized`}
                  placeholder={`data:image/svg+xml;base64,${toBase64(
                    shimmer(500, 500),
                  )}`}
                />
                <div className=" text-center flex-1">
                  <PostBody
                    body={bazar.description}
                    locale={locale}
                    id={bazar.id}
                  />
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default BazarDor;
