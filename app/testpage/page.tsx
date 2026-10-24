"use client";
import React, { useState } from "react";
import FoodCard from "@/app/custom-components/cards/FoodCard";
import { mockFoodItems } from "@/app/mockdata/foodData";
import RewardsSection from "@/app/custom-components/ui-sections/Reward-Sections";

const TestPage = () => {
  // const [lastItem, setLastItem] = useState<{ id: string | number; quantity: number } | null>(null);

  // const handleAdd = (id: string | number, quantity: number) => {
  //   setLastItem({ id, quantity });
  // };

  return (
    // <main className="min-h-screen w-full bg-zinc-50 px-4 py-12 dark:bg-zinc-950 md:px-8 2xl:px-16">
    //   {/* <div className="mx-auto max-w-7xl">
    //     <div className="mb-8 flex flex-col gap-2">
    //       <h1 className="font-heading text-2xl font-bold text-zinc-900 dark:text-zinc-100 md:text-3xl 2xl:text-4xl">
    //         Food Cards Preview
    //       </h1>
    //       <p className="font-sans text-sm text-zinc-500 dark:text-zinc-400">
    //         Testing FoodCard with responsive breakpoints (below md, md:, 2xl:) and interactive collapse / add actions.
    //       </p>
    //       {lastItem && (
    //         <div className="mt-2 inline-flex w-fit items-center rounded-md bg-zinc-900 px-3 py-1 text-xs font-mono text-zinc-100 dark:bg-zinc-100 dark:text-zinc-900">
    //           Cart Update: ID = {String(lastItem.id)} | Qty = {lastItem.quantity}
    //         </div>
    //       )}
    //     </div>

    //     <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 2xl:grid-cols-3 2xl:gap-8">
    //       {mockFoodItems.map((food) => (
    //         <FoodCard
    //           key={food.id}
    //           {...food}
    //           onAdd={handleAdd}
    //         />
    //       ))}
    //     </div>
    //   </div> */}
    // </main>
    <main className="mt-30">
      <RewardsSection />
    </main>
  );
};

export default TestPage;
