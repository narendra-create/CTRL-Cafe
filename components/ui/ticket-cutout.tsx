import type { CSSProperties } from "react";
import { Scissors } from "lucide-react";

type TicketCutLineProps = {
  color?: string;
  width?: string | number;
  thickness?: number;
  dashLength?: number;
  dashGap?: number;
  iconSize?: number;
  orientation?: "horizontal" | "vertical";
  iconPosition?: "start" | "center";
  className?: string;
  iconColour?: string;
};

export function TicketCutLine({
  color = "#a1a1aa",
  width = "100%",
  thickness = 2,
  dashLength = 6,
  dashGap = 5,
  iconSize = 18,
  orientation = "horizontal",
  iconPosition = "start",
  className = "",
  iconColour
}: TicketCutLineProps) {
  const isHorizontal = orientation === "horizontal";

  const length = typeof width === "number" ? `${width}px` : width;

  const containerStyle: CSSProperties = isHorizontal
    ? { width: length, color }
    : { height: length, color };

  const lineStyle: CSSProperties = isHorizontal
    ? {
        height: thickness,
        flex: "1 1 0%",
        minWidth: 0,
        backgroundImage: `repeating-linear-gradient(
          to right,
          currentColor 0 ${dashLength}px,
          transparent ${dashLength}px ${dashLength + dashGap}px
        )`,
      }
    : {
        width: thickness,
        flex: "1 1 0%",
        minHeight: 0,
        backgroundImage: `repeating-linear-gradient(
          to bottom,
          currentColor 0 ${dashLength}px,
          transparent ${dashLength}px ${dashLength + dashGap}px
        )`,
      };

  const line = (key: string) => (
    <span key={key} className="block" style={lineStyle} />
  );

  const scissors = (
    <Scissors
      size={iconSize}
      strokeWidth={2.9}
      aria-hidden="true"
      className={`shrink-0 ${isHorizontal ? "" : "rotate-90"} ${iconColour}`}
    />
  );

  return (
    <div
      aria-hidden="true"
      className={`flex items-center gap-1.5 ${
        isHorizontal ? "flex-row" : "flex-col"
      } ${className}`}
      style={containerStyle}
    >
      {iconPosition === "center" ? (
        <>
          {line("before")}
          {scissors}
          {line("after")}
        </>
      ) : (
        <>
          {scissors}
          {line("main")}
        </>
      )}
    </div>
  );
}
