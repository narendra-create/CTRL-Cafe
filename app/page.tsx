import Image from "next/image";
import {
  Herosection,
  HookSection,
  PopularSection,
} from "@/app/custom-components/ui-sections/Homepage-Sections";

export default function Home() {
  return (
    <main className="pt-20 md:pt-25 pb-10 md:pb-5">
      <Herosection />
      <HookSection />
      <PopularSection />
    </main>
  );
}
