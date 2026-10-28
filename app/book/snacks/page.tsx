"use client";
import FoodCard from "@/app/custom-components/cards/FoodCard";
import React, { useEffect, useState } from "react";
import { getFoodItems } from "@/lib/controllers/foodController";
import { foodItems } from "@/src/db/schema";

const Snacks = () => {
  const [FoodItems, setFoodItems] = useState<Array<
    typeof foodItems.$inferSelect
  > | null>(null);
  const [Loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchFoodItems() {
      const result = await getFoodItems();
      if (result.length === 0) {
        setFoodItems(null);
        setLoading(false);
        return;
      }

      setFoodItems(result);
      setLoading(false);
      return;
    }

    fetchFoodItems();
  }, []);

  if (Loading) {
    return <div>Loading...</div>;
  }

  return (
    <section className="flex flex-col gap-8 md:gap-10">
      <div className="mt-6 md:mt-8 mb-4 md:mb-6">
        <h1 className="text-lg md:text-7xl font-bold tracking-[-0.03em] leading-tight">
          Choose Some Snacks<span className="text-accent">.</span>
        </h1>
        <p className="text-muted-foreground text-[15px] mt-2 max-w-[44em] leading-relaxed">
          Every good gaming session deserves good snacks. Pick your favourites,
          adjust the quantities, and we'll add them to your booking.
        </p>
      </div>
      <div>{FoodItems && FoodItems.map((food) => <FoodCard {...food} />)}</div>
    </section>
  );
};

export default Snacks;
