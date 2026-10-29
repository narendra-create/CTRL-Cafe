"use client";
import FoodCard from "@/app/custom-components/cards/FoodCard";
import React, { useEffect, useState } from "react";
import { getFoodItems } from "@/lib/controllers/foodController";
import { foodItems } from "@/src/db/schema";
import mockFoodItems from "@/app/mockdata";
import { useBooking } from "@/app/book/Book-page-contaxt";
import { useRouter } from "next/navigation";

const Snacks = () => {
  const [FoodItems, setFoodItems] = useState<Array<
    typeof foodItems.$inferSelect
  > | null>(null);
  const [Loading, setLoading] = useState(false);
  const { addFood, selectedFoods, setFoodQuantity } = useBooking();
  const router = useRouter();

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
    // fetchFoodItems();
    setFoodItems(mockFoodItems);
  }, []);

  if (Loading) {
    return <div>Loading...</div>;
  }

  return (
    <section className="flex flex-col gap-5 md:gap-0">
      <div className="mt-6 md:mt-8 mb-4 md:mb-6">
        <h1 className="text-2xl md:text-7xl font-bold tracking-[-0.03em] leading-tight">
          Choose Some Snacks<span className="text-accent">.</span>
        </h1>
        <p className="text-muted-foreground text-xs mx-2.5 md:mx-0 md:text-[15px] mt-2 max-w-[44em] leading-relaxed">
          Every good gaming session deserves good snacks. Pick your favourites,
          adjust the quantities, and we'll add them to your booking.
        </p>
      </div>
      <div className="md:py-3 rounded-2xl md:px-3 md:border border-foreground/5 bg-foreground/1 md:mb-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:max-h-[150vh] overflow-y-scroll scrollbar-thumb-accent/80 scrollbar-thin md:pr-2">
          {FoodItems &&
            FoodItems.map((food, index) => {
              const singleItem = selectedFoods.find(
                (selected) => selected.id === food.id,
              );

              return (
                <FoodCard
                  {...food}
                  key={food.id}
                  addButton
                  loadingMode={index <= 2 ? "eager" : "lazy"}
                  onAdd={(_id, quantity) => {
                    if (singleItem) {
                      setFoodQuantity(food.id, quantity);
                    } else if (quantity > 0) {
                      addFood(food, quantity);
                    }
                  }}
                />
              );
            })}
        </div>
      </div>
    </section>
  );
};

export default Snacks;
