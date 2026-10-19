import Image from "next/image";
import React from "react";
import { TicketCutLine } from "@/components/ui/ticket-cutout";
import { Ticket } from "lucide-react";

const Herosection = () => {
  return (
    <section className="w-[95%] dark:shadow-[0px_10px_20px_2px_#1a202c] shadow-[0px_10px_20px_2px_#cbd5e0] relative rounded-xl mx-auto h-135 md:h-180 md:w-[98%] border border-gray-400/50 dark:border-gray-400/25 bg-gray-100 dark:bg-black md:bg-transparent overflow-hidden">
      <div className="h-[62%] relative md:h-full md:z-0">
        <Image
          alt="hero-image"
          src={"/homepage-hero-image.webp"}
          fill
          priority
          className="w-full h-full object-center object-cover rounded-t-lg"
        />
        <div className="absolute bg-black w-full h-full hidden md:block md:opacity-30 z-10 hover:opacity-45 transition-all ease-out duration-200"></div>
      </div>
      <TicketCutLine
        thickness={4}
        orientation="horizontal"
        iconPosition="center"
        dashGap={6}
        iconColour="text-yellow-800"
        iconSize={19}
        width="98%"
        className="mx-auto md:hidden relative"
      />
      <div className="pb-3 relative md:pb-6 md:w-[45%] md:flex md:backdrop-blur-xs flex-col justify-between md:h-[45%] rounded-b-xl md:absolute md:bottom-13 md:left-15 z-40 md:bg-black/55 md:border border-white/20 md:rounded-lg">
        <div className="absolute hidden md:block z-50 top-6 right-8 text-gray-300">
          <Ticket size={70} strokeWidth={1.8} />
        </div>
        <div className="md:pt-8 md:px-5">
          <h1 className="font-heading font-bold md:font-semibold leading-13 tracking-wide text-[26px] md:text-5xl ml-1 px-4 pt-2.5 md:text-white">
            Your Seat Is Waiting
          </h1>
          <h2 className="font-sans w-[96%] text-[15px] md:text-xl md:font-extralight line-clamp-2 md:mt-3.5 md:w-[90%] md:mb-8 mx-auto md:mx-0 text-gray-500 md:text-gray-400/80 px-5 md:px-8">
            Book your PC or console gaming seat, order snacks online, and enjoy
            an epic gaming session with your friends at CTRL Cafe.
          </h2>
        </div>
        <div className="flex justify-between items-center mx-auto md:mx-0 mt-[3%] md:mt-0 px-4 md:px-6">
          <div className="place-content-center pl-3 md:pl-7 text-[15px] md:text-lg text-gray-500 dark:text-gray-300 md:text-gray-200">
            <span className="mr-1.5 font-heading font-bold text-lg md:text-3xl text-black dark:text-white md:text-white">
              14
            </span>
            <span className="md:hidden">
              Seats
              <br />
              &nbsp;Free Now
            </span>
            <span className="hidden md:block">Seats Free Now</span>
          </div>
          <button className="bg-accent hover:bg-accent/85 dark:hover:bg-accent/85 transition-all hover:scale-105 hover:-translate-y-1.2 ease-out duration-200 dark:bg-accent/95 dark:font-bold md:font-bold text-accent-foreground px-4 py-3 text-[17px] md:text-xl font-medium tracking-wide font-sans rounded-md">
            Reserve a Seat
          </button>
        </div>
      </div>
    </section>
  );
};

export default Herosection;
