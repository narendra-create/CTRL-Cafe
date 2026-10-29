import { BookingProvider } from "@/app/book/Book-page-contaxt";
import BookingSidebar from "@/app/custom-components/Booking-Sidebar";
import React, { ReactNode } from "react";

const layout = ({ children }: { children: ReactNode }) => {
  return (
    <BookingProvider>
      <main className="md:flex w-full md:w-[92vw] md:ml-20 mt-20 md:mt-25">
        <div className="w-full md:pr-20 px-4">{children}</div>
        <aside className="md:w-[28vw] px-4 mt-10 md:mt-35 md:px-2">
          <BookingSidebar />
        </aside>
      </main>
    </BookingProvider>
  );
};

export default layout;
