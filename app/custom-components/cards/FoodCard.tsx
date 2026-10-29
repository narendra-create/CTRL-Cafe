"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Plus, Minus, Users } from "lucide-react";

export interface FoodCardProps {
  id: string | number;
  name: string;
  imageUrl?: string | null;
  price: number | string;
  serves: number | string;
  description?: string | null;
  addButton?: boolean;
  quantity?: number;
  onAdd?: (id: string | number, quantity: number) => void;
  className?: string;
  loadingMode?: "eager" | "lazy";
}

const FoodCard = ({
  id,
  name,
  imageUrl,
  price,
  serves,
  description,
  addButton = false,
  quantity,
  onAdd,
  className = "",
  loadingMode = "lazy",
}: FoodCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [canClamp, setCanClamp] = useState(() =>
    Boolean(description && description.length > 60),
  );
  const [internalQty, setInternalQty] = useState(0);
  const textRef = useRef<HTMLParagraphElement>(null);

  const currentQty = quantity !== undefined ? quantity : internalQty;

  useEffect(() => {
    if (isExpanded) return;
    const element = textRef.current;
    if (!element) return;

    const checkOverflow = () => {
      setCanClamp(element.scrollHeight > element.clientHeight);
    };

    checkOverflow();
    window.addEventListener("resize", checkOverflow);
    return () => window.removeEventListener("resize", checkOverflow);
  }, [description, isExpanded]);

  const updateQuantity = (newQty: number) => {
    if (quantity === undefined) {
      setInternalQty(newQty);
    }
    onAdd?.(id, newQty);
  };

  const handleAddInitial = (e: React.MouseEvent) => {
    e.stopPropagation();
    updateQuantity(1);
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    updateQuantity(currentQty + 1);
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextQty = Math.max(0, currentQty - 1);
    updateQuantity(nextQty);
  };

  const formattedPrice =
    typeof price === "number"
      ? `₹${price.toLocaleString("en-IN")}`
      : typeof price === "string" && price.startsWith("₹")
        ? price
        : `₹${price}`;

  const formattedServing =
    typeof serves === "number" ? `Serves ${serves}` : serves;

  return (
    /* Card Container */
    <article
      className={`group flex flex-col justify-between w-full rounded-xl border border-zinc-200 bg-white p-3 transition-all duration-200 ease-out hover:border-zinc-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zinc-700 md:rounded-2xl md:p-4 2xl:rounded-3xl 2xl:p-5 ${className}`}
    >
      {/* Top Section */}
      <div className="flex flex-col gap-2.5 md:gap-3 2xl:gap-4">
        {/* Image Section */}
        <div className="relative h-40 w-full overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-900 md:h-48 md:rounded-xl 2xl:h-56 2xl:rounded-2xl">
          <Image
            src={imageUrl || "/food-card-placeholder.webp"}
            alt={name}
            loading={loadingMode}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1536px) 50vw, 33vw"
            className="object-cover object-center transition-transform duration-300 ease-out group-hover:scale-105"
          />
          {/* Serving Badge */}
          <div className="absolute top-2 left-2 flex items-center gap-1 rounded-md bg-black/60 px-2 py-0.5 text-xs font-mono text-white backdrop-blur-xs md:top-2.5 md:left-2.5 md:text-xs 2xl:top-3 2xl:left-3 2xl:text-sm">
            <Users className="size-3 md:size-3.5 2xl:size-4" />
            <span>{formattedServing}</span>
          </div>
        </div>

        {/* Info Section */}
        <div className="flex flex-col gap-1 md:gap-1.5 2xl:gap-2">
          {/* Title Section */}
          <h3 className="font-heading text-base font-semibold text-zinc-900 line-clamp-1 dark:text-zinc-100 md:text-lg 2xl:text-xl">
            {name}
          </h3>

          {/* Description Section */}
          {description && (
            <div className="flex flex-col items-start gap-1">
              <p
                ref={textRef}
                className={`font-sans text-xs leading-relaxed text-zinc-500 dark:text-zinc-400 md:text-sm md:leading-relaxed 2xl:text-base 2xl:leading-relaxed ${
                  isExpanded
                    ? ""
                    : "line-clamp-2 md:line-clamp-2 2xl:line-clamp-3"
                }`}
              >
                {description}
              </p>
              {canClamp && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsExpanded((prev) => !prev);
                  }}
                  className="cursor-pointer font-sans text-xs font-medium text-zinc-900 underline underline-offset-2 hover:text-zinc-600 dark:text-zinc-200 dark:hover:text-zinc-400 md:text-xs 2xl:text-sm"
                >
                  {isExpanded ? "less" : "more"}
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Footer Section */}
      <div className="mt-3 flex items-center justify-between border-t border-zinc-100 pt-3 dark:border-zinc-800/80 md:mt-4 md:pt-3.5 2xl:mt-5 2xl:pt-4">
        {/* Price Section */}
        <div className="flex flex-col">
          <span className="font-heading text-base font-bold text-zinc-900 dark:text-zinc-50 md:text-lg 2xl:text-xl">
            {formattedPrice}
          </span>
        </div>

        {/* Action Section */}
        {addButton && (
          <div>
            {currentQty === 0 ? (
              <button
                type="button"
                onClick={handleAddInitial}
                className="flex cursor-pointer items-center gap-1 rounded-lg bg-zinc-900 px-3 py-1.5 font-sans text-xs font-medium text-white transition-all duration-200 hover:bg-zinc-800 active:scale-95 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 md:px-3.5 md:py-2 md:text-sm 2xl:px-4 2xl:py-1.5 2xl:text-sm"
              >
                <span>Add</span>
                <Plus className="size-3.5 md:size-4 2xl:size-4" />
              </button>
            ) : (
              <div className="flex items-center rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 px-1 py-0.75 md:px-1.5 md:py-1 2xl:px-2 2xl:py-1">
                <button
                  type="button"
                  onClick={handleDecrement}
                  className="flex cursor-pointer items-center justify-center p-1 rounded-md hover:bg-zinc-800 dark:hover:bg-zinc-200 active:scale-90 transition-all"
                  aria-label="Decrease quantity"
                >
                  <Minus className="size-3.5 md:size-4 2xl:size-4" />
                </button>
                <span className="min-w-6 text-center font-mono text-xs font-bold md:text-sm 2xl:text-base px-1">
                  {currentQty}
                </span>
                <button
                  type="button"
                  onClick={handleIncrement}
                  className="flex cursor-pointer items-center justify-center p-1 rounded-md hover:bg-zinc-800 dark:hover:bg-zinc-200 active:scale-90 transition-all"
                  aria-label="Increase quantity"
                >
                  <Plus className="size-3.5 md:size-4 2xl:size-4" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </article>
  );
};

export default FoodCard;
