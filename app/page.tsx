import Image from "next/image";
import {
  Herosection,
  HookSection,
} from "@/app/custom-components/ui-sections/Homepage-Sections";

export default function Home() {
  return (
    <main className="pt-20 md:pt-25">
      <Herosection />
      <HookSection />
    </main>
  );
}
