import React from "react";

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
  date: Date | string;
  isRewardGranted: boolean | string;
  paidAmount: number | string;
  bookingId: string;
  razorpayOrderId: string;
  bookedStations: TicketStationsDetails[];
  orderedSnacks: TicketSnacksDetails[];
};

const BookingTicketCard = ({ Props }: { Props: TicketCardProps }) => {
  return (
    <section className="grid w-full grid-cols-1 md:grid-cols-[4fr_1.5fr] md:min-h-120">
      {/* Red Section */}
      <div className="ticket-notch px-5 pt-5 pb-10 md:p-8 min-h-100 rounded-t-3xl bg-linear-to-b from-[#E02A35] to-[#A81A24] [--cut-1:0_100%] [--cut-2:100%_100%] md:min-h-96 md:rounded-l-3xl md:rounded-r-none md:[--cut-1:100%_0]">
        <div className="flex flex-col md:flex-row justify-center items-start md:justify-between md:max-w-[85%] w-full">
          <div>
            <h6 className="font-sans font-semibold text-sm md:text-lg">
              CTRL Cafe
            </h6>
            <h1 className="font-heading font-extrabold text-2xl md:text-4xl">
              Booking Ticket
            </h1>
          </div>
          <div className="flex flex-row pl-0.5 md:pl-0 gap-5 divide-x-2 divide-foreground/80 my-2 md:my-0">
            <div className="pr-5">
              <h5 className="font-heading text-sm md:text-[16px] tracking-tight">
                Start Time
              </h5>
              <p className="font-sans pl-1 md:text-xl font-bold tracking-tight">
                {Props.startTime.toString()}
              </p>
            </div>
            <div>
              <h5 className="font-heading text-sm md:text-[16px] tracking-tight">
                End Time
              </h5>
              <p className="font-sans pl-1 md:text-xl font-bold tracking-tight">
                {Props.endTime.toString()}
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-col md:flex-row md:w-full md:gap-5 mt-3 md:mt-7">
          <div className="w-full">
            <h6 className="border-b border-foreground/50 font-bold pl-2 pb-1">
              Stations & Players
            </h6>
            <ul>
              {Props.bookedStations &&
                Props.bookedStations.map((station, index) => (
                  <li
                    key={station.stationlabel}
                    className={`flex justify-between text-foreground items-center pr-5 pt-2 pl-3 ${index !== 0 && "border-t mt-1.5 pt-1.5 border-foreground/50"}`}
                  >
                    <div>
                      <h6 className="font-normal text-[15px]">
                        {station.parentdevicename}
                      </h6>
                      <p className="text-sm font-light text-foreground/85">
                        {station.stationlabel}
                      </p>
                    </div>
                    <div className="px-2 w-fit h-fit py-1.5 rounded-lg text-sm flex items-center justify-center bg-background/30">
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
          <div className="w-full mt-10 md:mt-0">
            <h6 className="border-b border-foreground/50 pl-2 font-bold pb-1">Snacks</h6>
            <ul>
              {Props.orderedSnacks &&
                Props.orderedSnacks.map((snack, index) => (
                  <li
                    key={snack.snackname}
                    className={`flex justify-between items-center pr-5 pt-2 pl-3 ${index !== 0 && "border-t mt-1.5 pt-1.5 border-foreground/50"}`}
                  >
                    <div>
                      <h6 className="font-normal text-[15px]">
                        {snack.snackname}
                      </h6>
                    </div>
                    <div className="text-sm font-semibold">x{snack.qty}</div>
                  </li>
                ))}
            </ul>
          </div>
        </div>
        <div></div>
      </div>
      {/* Black or white section */}
      <div className="ticket-notch min-h-50 rounded-b-3xl bg-foreground [--cut-1:0_0] [--cut-2:100%_0] md:rounded-l-none md:rounded-r-3xl md:border-t-0 md:border-l-2 md:[--cut-2:0_100%]"></div>
    </section>
  );
};

export default BookingTicketCard;
