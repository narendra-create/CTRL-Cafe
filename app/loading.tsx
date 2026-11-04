import CtrlCafeLoader from "@/components/CTRL-cafe-Loader";

export default function Loading() {
  return (
    <main className="grid min-h-[70svh] place-items-center">
      <CtrlCafeLoader label="Initializing Session" size={100} />
    </main>
  );
}
