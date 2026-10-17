"use client";
import React from "react";
import type { deviceCardType } from "@/types/deviceTypes";
import Image from "next/image";

const DeviceCard = (deviceDetails: deviceCardType) => {
  return (
    <section className="flex group/deviceCard hover:scale-99 transition-all ease-out duration-200 items-center flex-col rounded-2xl relative bg-white/90 px-2.5 pb-0 h-70 md:h-110 w-full mx-2 md:mx-0 md:w-130">
      <div className="absolute w-full h-full z-10 bg-black/0 p-0 m-0 group-hover/deviceCard:bg-black/20 transition-colors ease-out duration-200"></div>
      <div className="relative w-full flex-8 min-h-0 bg-black/7 rounded-2xl mt-2.5">
        <Image
          alt="Device Image"
          src={deviceDetails?.imageUrl ?? "/new-device-cutout.webp"}
          fill
          sizes="100vw"
          className="object-cover object-top"
        />
      </div>
      <div className="relative z-20 flex items-center justify-center gap-3 w-[70%] text-black/80 flex-[1.5] h-fit">
        <h5 className="text-center font-heading font-semibold tracking-wider text-2xl md:text-4xl h-fit line-clamp-1">
          {deviceDetails?.name}
        </h5>
        {!deviceDetails?.isNewDevice && <p>- {deviceDetails.units}</p>}
      </div>
    </section>
  );
};

export default DeviceCard;
