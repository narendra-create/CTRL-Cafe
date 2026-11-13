"use client";
import {
  calculateDuration,
  formatDateIntoShortReadableText,
  formatMoneydash,
  formatTimeIntoShortReadableText,
} from "@/lib/utils/tools";
import React, { useState } from "react";
import { Copy, Check, Star } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { toast } from "@/components/ui/toast";

export type TicketStationsDetails = {
  parentdevicename: string;
  stationlabel: string;
  stationplayers: string | number;
};
export type TicketSnacksDetails = {
  snackname: string;
  qty: number | string;
};

export type TicketCardProps = {
  startTime: Date | string;
  endTime: Date | string;
  isRewardGranted: boolean | string;
  paidAmount: number | string;
  bookingId: string;
  razorpayOrderId: string;
  bookedStations: TicketStationsDetails[];
  orderedSnacks: TicketSnacksDetails[];
};

const BookingTicketCard = ({ Props }: { Props: TicketCardProps }) => {
  const [Copied, setCopied] = useState(false);
  const formattedStartTime = formatTimeIntoShortReadableText(Props.startTime);
  const formattedEndTime = formatTimeIntoShortReadableText(Props.endTime);
  const formattedDate = formatDateIntoShortReadableText(Props.startTime);
  const duration = calculateDuration(
    Props.startTime.toString(),
    Props.endTime.toString(),
  );

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(String(Props.bookingId));

      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch (error) {
      console.error("Failed to copy booking ID:", error);
    }
  }
  return (
    <section className="grid w-full grid-cols-1 md:grid-cols-[4fr_1fr] md:min-h-120">
      {/* Red Section */}
      <div className="ticket-notch px-5 pt-5 pb-10 md:p-8 min-h-100 rounded-t-3xl bg-linear-to-b from-[#E02A35] to-[#A81A24] [--cut-1:0_100%] [--cut-2:100%_100%] md:min-h-96 md:rounded-l-3xl md:rounded-r-none md:[--cut-1:100%_0]">
        <div className="flex flex-col md:flex-row justify-center items-start md:justify-between md:max-w-[88%] w-full">
          <div className="mb-2">
            <h6 className="font-sans font-semibold text-sm md:text-lg">
              CTRL Cafe
            </h6>
            <h1 className="font-heading uppercase font-[1000] text-[2.9ch] md:text-4xl">
              Booking Ticket
            </h1>
          </div>
          <div className="flex flex-row pl-0.5 md:pl-0 gap-5 divide-x-2 divide-foreground/80 my-2 md:my-0">
            <div className="pr-5">
              <h5 className="font-heading text-sm md:text-[16px] tracking-tight">
                Start Time
              </h5>
              <p className="font-sans pl-1 text-[25px] md:text-3xl font-bold tracking-tight">
                {formattedStartTime.toString()}
              </p>
            </div>
            <div>
              <h5 className="font-heading text-sm md:text-[16px] tracking-tight">
                End Time
              </h5>
              <p className="font-sans pl-1 text-[25px] md:text-3xl font-bold tracking-tight">
                {formattedEndTime.toString()}
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-col md:flex-row md:w-full md:gap-5 mt-3 md:mt-7">
          <div className="w-full max-h-[22vh] overflow-y-scroll scrollbar-thumb-accent">
            <h6 className="border-b border-foreground/50 font-medium pl-2 md:pl-0 pb-1 text-xs">
              Stations & Players
            </h6>
            <ul>
              {Props.bookedStations &&
                Props.bookedStations.map((station, index) => (
                  <li
                    key={station.stationlabel}
                    className={`flex justify-between text-foreground items-center pr-5 pt-2 pl-3 md:pl-0.5 ${index !== 0 && "border-t mt-1.5 pt-1.5 border-foreground/50"} ${index === Props.bookedStations.length - 1 && "border-b mb-1.5 pb-1.5 "}`}
                  >
                    <div>
                      <h6 className="font-semibold text-[15px]">
                        {station.parentdevicename}
                      </h6>
                      <p className="text-sm font-light text-foreground/85">
                        {station.stationlabel}
                      </p>
                    </div>
                    <div className="px-1.5 w-fit h-fit py-1 rounded-lg text-xs flex items-center justify-center bg-background/30">
                      {station.stationplayers}
                      &nbsp;
                      {Number(station.stationplayers) > 1
                        ? "Players"
                        : "Player"}
                    </div>
                  </li>
                ))}
            </ul>
          </div>
          <div className="w-full mt-10 md:mt-0 max-h-[22vh] overflow-y-auto scrollbar-thumb-accent">
            <h6 className="border-b border-foreground/50 pl-2 font-medium pb-1 text-xs">
              Snacks
            </h6>
            <ul>
              {Props.orderedSnacks &&
                Props.orderedSnacks.map((snack, index) => (
                  <li
                    key={snack.snackname}
                    className={`flex justify-between items-center pr-5 pt-2 pl-3 ${index !== 0 && "border-t mt-1.5 pt-1.5 border-foreground/50"}`}
                  >
                    <div>
                      <h6 className="font-semibo3xl text-[15px]">
                        {snack.snackname}
                      </h6>
                    </div>
                    <div className="text-sm font-semibold">x{snack.qty}</div>
                  </li>
                ))}
            </ul>
          </div>
        </div>
        <div className="flex flex-col md:flex-row-reverse md:justify-between md:mt-6 md:pl-0.5">
          <div className="flex justify-between items-center px-[8%] md:px-4 md:w-[40%] bg-accent text-accent-foreground font-heading py-4 rounded-xl my-7 md:my-0 md:mt-12">
            <span className="font-bold text-sm md:text-[14px] md:font-extrabold">
              Grand Total
            </span>
            <span className="font-extrabold md:font-[1000] tracking-tighter text-xl md:text-2xl overflow-x-auto w-[60%] text-end">
              ₹{formatMoneydash(Number(Props.paidAmount))}
            </span>
          </div>
          <div className="flex flex-col">
            <h6 className="text-xs font-medium">Booking ID</h6>
            <div className="flex items-center gap-2 break-all">
              <p className="font-medium text-sm">{Props.bookingId}</p>
              <button
                type="button"
                onClick={handleCopy}
                aria-label="Copy booking ID"
                title={Copied ? "Copied!" : "Copy booking ID"}
                className={`rounded-full p-2 transition-all duration-200
                bg-foreground/8 backdrop-blur-sm border border-foreground/50 active:scale-90
                ${Copied ? "text-green-300 scale-110" : "text-white/78 hover:text-white hover:bg-foreground/20"}`}
              >
                {Copied ? (
                  <Check
                    size={16}
                    strokeWidth={5}
                    className="animate-in zoom-in duration-200"
                  />
                ) : (
                  <Copy size={16} strokeWidth={3} />
                )}
              </button>
            </div>
            <h6 className="text-xs font-medium mt-2.5">Payment ID</h6>
            <div className="flex items-center gap-2 break-all">
              <p className="font-medium text-sm">{Props.bookingId}</p>
              <button
                type="button"
                onClick={handleCopy}
                aria-label="Copy booking ID"
                title={Copied ? "Copied!" : "Copy booking ID"}
                className={`rounded-full p-2 transition-all duration-200
                bg-foreground/8 backdrop-blur-sm border border-foreground/50 active:scale-90
                ${Copied ? "text-green-300 scale-110" : "text-white/78 hover:text-white hover:bg-foreground/20"}`}
              >
                {Copied ? (
                  <Check
                    size={16}
                    strokeWidth={5}
                    className="animate-in zoom-in duration-200"
                  />
                ) : (
                  <Copy size={16} strokeWidth={3} />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Black or white section */}
      <div className="ticket-notch py-3 px-5 flex md:flex-col items-center md:justify-center gap-5 border-t-3 border-dashed border-foreground/60 min-h-45 rounded-b-3xl bg-[#232323] [--cut-1:0_0] [--cut-2:100%_0] md:rounded-l-none md:rounded-r-3xl md:border-t-0 md:border-l-3 md:[--cut-2:0_100%]">
        <div className="p-2 w-fit h-fit bg-white rounded-lg">
          <QRCodeSVG
            value={Props.bookingId}
            level="M"
            size={112}
            title="Booking Ticket"
            boostLevel={false}
            minVersion={1}
            bgColor="transparent"
            className="md:hidden"
          />
          <QRCodeSVG
            value={Props.bookingId}
            level="M"
            size={148}
            title="Booking Ticket"
            boostLevel={false}
            minVersion={1}
            bgColor="transparent"
            className="hidden md:block"
          />
        </div>
        <div>
          <div className="flex flex-col items-start md:items-center justify-center my-2">
            <p className="text-gray-300/70">Duration</p>
            <h4 className="font-[1000] pl-0.5 font-heading text-2xl md:text-3xl text-accent/90 tracking-wider md:tracking-normal">
              {duration} {duration && duration > 1 ? "hours" : "hour"}
            </h4>
          </div>
          <div className="flex flex-col items-start md:items-center justify-center my-2">
            <p className="text-gray-300/70">Date</p>
            <h4 className="font-bold font-heading md:text-xl">{formattedDate}</h4>
          </div>
          <div className="bg-accent text-accent-foreground flex text-xs md:text-sm px-2 py-1.5 mt-3 mb-2 rounded-xl items-center justify-center gap-1">
            <Star fill="black" size={17} className="mb-0.5 hidden md:block"/>
            <Star fill="black" size={13} className="mb-0.5 md:hidden"/>
            <span>
              <span>+</span>
              <span className="font-[1000] md:font-bold">10 pts earned</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BookingTicketCard;
