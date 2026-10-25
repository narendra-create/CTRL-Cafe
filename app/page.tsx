import {
  Herosection,
  HookSection,
  PopularSection,
  RewardsHomepageSection,
} from "@/app/custom-components/ui-sections/Homepage-Sections";
import { getCurrentPoints } from "@/lib/controllers/profileController";
import { Suspense } from "react";

async function RewardsData() {
  const points = await getCurrentPoints();
  return <RewardsHomepageSection Points={points} />;
}

export default function Home() {
  const Points = undefined;
  return (
    <main className="pt-20 md:pt-25 pb-10 md:pb-5 overflow-hidden">
      <Herosection />
      <HookSection />
      <PopularSection />
      <Suspense fallback={<RewardsHomepageSection Points={undefined} />}>
        <RewardsData />
      </Suspense>
    </main>
  );
}
